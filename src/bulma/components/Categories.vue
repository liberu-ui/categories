<template>
    <draggable :list="categories"
        :animation="150"
        :group="{ name: 'categories', put: unique }"
        handle=".dropdown-item"
        :disabled="!state.editable || state.query !== '' || !!state.category"
        @change="change"
        @end="endDragging"
        @start="startDragging"
        tag="ul">
        <category v-for="category in categories"
            :category="category"
            :key="category.id"
            :splice="splice"
            v-on="$listeners"/>
    </draggable>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
    name: 'Categories',

    components: { Draggable, Category: () => import('./Category.vue') },

    inject: ['state'],

    props: {
        categories: {
            type: Array,
            required: true,
        },
        parentId: {
            type: Number,
            default: null,
        },
    },

    methods: {
        change(event) {
            if (event.moved) {
                this.move(event.moved);
            } else if (event.added) {
                this.move(event.added);
            }
        },
        endDragging() {
            this.state.dragging = null;
        },
        splice(category) {
            const index = this.categories.findIndex(({ id }) => id === category.id);

            this.categories.splice(index, 1);
        },
        move({ element, newIndex }) {
            newIndex++;
            this.$emit('moved', { id: element.id, parentId: this.parentId, newIndex });
        },
        startDragging($event) {
            this.state.selected = null;
            // eslint-disable-next-line no-underscore-dangle
            this.state.dragging = $event.item.__vue__.$options.propsData.category;
        },
        unique(to) {
            // eslint-disable-next-line no-underscore-dangle
            const instanceProps = to.el.__vue__.$options.propsData;
            const categories = instanceProps.list || instanceProps.categories;

            return !categories.some(category => category.name === this.state.dragging.name);
        },
    },
};
</script>
