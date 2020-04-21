<template>
    <li>
        <a class="category dropdown-item"
            :class="{ 'is-bold has-background-light': isSelected }"
            @click="select">
            <div class="level">
                <div class="level-left">
                    <div class="level-item is-marginless"
                        v-if="hasChildren">
                        <span class="icon is-small"
                            @click.stop="toggle">
                            <fa icon="minus-square"
                                v-if="isExpanded"/>
                            <fa icon="plus-square"
                                v-else/>
                        </span>
                    </div>
                    <div class="level-item has-padding-left-large">
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <span v-html="highlight(category.name)"/>
                    </div>
                </div>
                <div class="level-right"
                    v-if="isSelected">
                    <div class="level-item">
                        <template v-if="state.editable">
                            <a class="button is-naked is-small"
                                @click.stop="edit">
                                <span class="icon">
                                    <fa icon="pencil-alt"/>
                                </span>
                            </a>
                            <confirmation @confirm="destroy">
                                <a class="is-naked has-margin-right-medium">
                                    <span class="icon">
                                        <fa icon="trash-alt"/>
                                    </span>
                                </a>
                            </confirmation>
                        </template>
                        <a class="delete is-small"
                            @click.stop="clear"/>
                    </div>
                </div>
            </div>
        </a>
        <categories :categories="category.subcategories"
            :parent-id="category.id"
            v-on="$listeners"
            v-show="!hasChildren || isExpanded"/>
    </li>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faMinusSquare, faPlusSquare, faPencilAlt, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import Confirmation from '@enso-ui/confirmation/bulma';
import Categories from './Categories.vue';

library.add(faMinusSquare, faPlusSquare, faPencilAlt, faTrashAlt);

export default {
    name: 'Category',

    components: { Categories, Confirmation },

    inject: ['errorHandler', 'route', 'state'],

    props: {
        category: {
            type: Object,
            required: true,
        },
        splice: {
            type: Function,
            required: true,
        },
    },

    computed: {
        hasChildren() {
            return this.category.subcategories.length > 0;
        },
        isExpanded() {
            return this.state.expanded.includes(this.category.id);
        },
        isSelected() {
            return this.state.selected && this.state.selected.id === this.category.id;
        },
    },

    methods: {
        bold(label, arg) {
            let from;

            try {
                from = new RegExp(`(${arg})`, 'gi');
            } catch {
                from = arg;
            }

            return `${label}`.replace(from, '<b>$1</b>');
        },
        clear() {
            this.$emit('input', null);
            this.state.selected = null;
        },
        destroy() {
            axios.delete(this.route('administration.categories.destroy', this.category.id))
                .then(() => {
                    this.splice(this.category.id);
                    this.state.selected = null;
                }).catch(this.errorHandler);
        },
        edit() {
            this.state.category = this.state.selected;
            this.state.original = this.state.selected.name;
        },
        highlight(label) {
            return this.state.query.toLowerCase().split(' ')
                .filter(arg => arg !== '')
                .reduce((label, arg) => this.bold(label, arg), label);
        },
        select() {
            this.state.selected = this.category;
            this.$emit('input', this.category.id);
        },
        toggle() {
            if (!this.hasChildren) {
                return;
            }

            const index = this.state.expanded.findIndex(id => id === this.category.id);

            if (index >= 0) {
                this.state.expanded.splice(index, 1);
            } else {
                this.state.expanded.push(this.category.id);
            }
        },
    },
};
</script>

<style lang="scss">
    a.category.dropdown-item {
        padding: 0.5em 0.7em;
    }
</style>
