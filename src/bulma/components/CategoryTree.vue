<template>
    <div class="category-tree"
        v-if="categories">
        <div class="category is-flex">
            <div class="control name has-icons-left has-icons-right"
                v-if="!state.category">
                <input class="input"
                    v-model="state.query"
                    :placeholder="i18n('Filter')">
                <span class="icon is-left">
                    <fa icon="search"/>
                </span>
                <span class="icon is-right">
                    <a class="delete is-small"
                        @click="state.query = ''"
                        v-if="state.query"/>
                </span>
            </div>
            <div class="control name has-icons-right"
                v-else>
                <input class="input"
                   :class="{ 'is-danger': errors.has('name') }"
                    v-model="state.category.name"
                    v-focus
                    :placeholder="i18n('Add new category')"
                    @input="errors.clear('name')">
                <span class="icon is-right">
                    <a class="delete is-small"
                        @click="state.category.name = ''"
                        v-if="state.category.name"/>
                </span>
                <p class="help is-danger"
                   v-if="errors.has('name')">
                    {{ errors.get('name') }}
                </p>
            </div>
            <template v-if="state.editable">
                <div class="control"
                    v-if="!state.query && !state.category">
                    <a class="button"
                        @click="state.category = factory(); selected = null">
                        <span>
                            {{ i18n('Add') }}
                        </span>
                        <span class="icon">
                            <fa icon="plus"/>
                        </span>
                    </a>
                </div>
                <template v-if="state.category">
                    <div class="control">
                        <a class="button"
                            @click="cancel">
                            <span>
                                {{ i18n('Cancel') }}
                            </span>
                            <span class="icon">
                                <fa icon="ban"/>
                            </span>
                        </a>
                    </div>
                    <div class="control"
                        v-if="state.category.name">
                        <a class="button"
                            :class="{'is-loading': state.loading}"
                            @click="save">
                            <span>
                                {{ i18n('Save') }}
                            </span>
                            <span class="icon">
                                <fa icon="database"/>
                            </span>
                        </a>
                    </div>
                </template>
            </template>
        </div>
        <div class="categories has-margin-top-large">
            <categories class="root"
                :categories="filtered"
                :parent-id="null"
                @moved="moved"
                v-on="$listeners"/>
        </div>
    </div>
</template>

<script>
import Errors from '@enso-ui/laravel-validation';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSearch, faPlus, faBan, faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { focus } from '@enso-ui/directives';
import Categories from './Categories.vue';

library.add(faSearch, faPlus, faBan, faDatabase);

export default {
    name: 'CategoryTree',

    directives: { focus },

    components: { Categories },

    inject: ['errorHandler', 'i18n', 'route'],

    props: {
        editable: {
            type: Boolean,
            default: false,
        },
        expanded: {
            type: Array,
            default: () => ([]),
        },
        value: {
            type: Number,
            default: null,
        },
    },

    data: v => ({
        categories: null,
        state: {
            category: null,
            editable: v.editable,
            expanded: v.expanded,
            loading: false,
            original: null,
            query: '',
            selected: null,
            dragging: null,
        },
        errors: new Errors(),
    }),

    computed: {
        filtered() {
            return this.state.query
                ? this.filter(this.clone())
                : this.categories;
        },
    },

    watch: {
        editable(editable) {
            this.state.editable = editable;
        },
        'state.query': {
            handler(query) {
                if (query.length > 0) {
                    this.expanded.splice(0, this.expanded.length);
                    this.expand(this.filtered);
                }
            },
        },
    },

    created() {
        this.fetch();
    },

    methods: {
        cancel() {
            this.state.category.name = this.state.original;
            this.state.category = null;
            this.state.original = null;
            this.errors.clear('name');
        },
        clone() {
            return JSON.parse(JSON.stringify(this.categories));
        },
        create() {
            const category = this.postPayload();
            this.state.loading = true;

            axios.post(this.route('administration.categories.store'), category)
                .then(({ data }) => {
                    this.push(data.category);
                    this.state.category = null;
                    this.state.loading = false;
                }).catch((error) => {
                    this.state.loading = false;

                    const { status, data } = error.response;

                    if (status === 422) {
                        this.errors.set(data.errors);
                        return;
                    }

                    this.errorHandler(error);
                });
        },
        expand(categories) {
            categories.forEach((category) => {
                this.expanded.push(category.id);

                this.expand(category.subcategories);
            });
        },
        expandParents(category) {
            const parent = this.flatten().find(({ subcategories }) => subcategories
                .some(({ id }) => id === category.id));

            if (parent) {
                this.state.expanded.push(parent.id);
                this.expandParents(parent);
            }
        },
        factory() {
            return {
                id: null,
                name: '',
                subcategories: [],
                orderIndex: null,
            };
        },
        fetch() {
            axios.get(this.route('administration.categories.index'))
                .then(({ data }) => {
                    this.categories = data;
                    this.preselect();
                }).catch(this.errorHandler);
        },
        filter(categories) {
            return categories
                .filter(category => this.matches(category))
                .map(category => this.map(category));
        },
        flatten(categories = this.categories) {
            return categories.reduce((flat, category) => {
                flat.push(category);
                flat.push(...this.flatten(category.subcategories));

                return flat;
            }, []);
        },
        map(category) {
            category.subcategories = this.filter(category.subcategories);

            return category;
        },
        matches(category) {
            return category.name.toLowerCase()
                .indexOf(this.state.query.toLowerCase()) > -1
                || category.subcategories
                    .some(child => this.matches(child));
        },
        moved({ id, parentId, newIndex }) {
            axios.patch(
                this.route('administration.categories.move', id),
                { parentId, newIndex },
            ).catch(this.errorHandler);
        },
        preselect() {
            if (!this.value) {
                return;
            }

            this.state.selected = this.flatten().find(({ id }) => id === this.value);
            this.expandParents(this.state.selected);
        },
        postPayload() {
            return {
                ...this.state.category,
                parentId: this.state.selected ? this.state.selected.id : null,
                orderIndex: this.state.selected
                    ? this.state.selected.subcategories.length + 1
                    : this.categories.length + 1,
            };
        },
        push(category) {
            if (this.state.selected) {
                this.flatten().find(({ id }) => id === this.state.selected.id)
                    .subcategories.push(category);
            } else {
                this.categories.push(category);
            }
        },
        save() {
            if (this.state.category.id) {
                this.update();
            } else {
                this.create();
            }
        },
        update() {
            this.state.loading = true;
            const { category } = this.state;

            axios.patch(this.route('administration.categories.update', category.id), category)
                .then(() => {
                    this.state.category = null;
                    this.state.loading = false;
                }).catch((error) => {
                    this.state.loading = false;

                    const { status, data } = error.response;

                    if (status === 422) {
                        this.errors.set(data.errors);
                        return;
                    }

                    this.errorHandler(error);
                });
        },
    },

    provide() {
        return {
            state: this.state,
        };
    },
};
</script>

<style lang="scss">
    .category-tree {
        .category .name {
            flex-grow: 1;
        }

        .categories {
            max-height: 35em;
            overflow: auto;

            ul {
                padding: 0.1em;
            }

            ul:not(.root) li {
                border-left: 1px solid #dbdbdb;
            }

            ul > li {
                margin-left: 1em;
                padding: 0.1em;

                &.sortable-ghost {
                    outline: 1px dashed;
                }
            }
        }

        .controls {
            border-bottom-left-radius: inherit;
            border-bottom-right-radius: inherit;
        }
    }
</style>
