<template>
    <tree-view :items="categories"
        v-bind="$attrs"
        v-on="$listeners"
        v-if="categories"
        ref="treeView"/>
</template>

<script>
import TreeView from '@enso-ui/tree-view/bulma';

export default {
    name: 'Categories',

    inject: ['errorHandler', 'route'],

    components: { TreeView },

    data: () => ({
        categories: null,
    }),

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(this.route('administration.categories.options'))
                .then(({ data }) => this.update(data))
                .catch(this.errorHandler);
        },
        update(data) {
            this.categories = data;
            this.$nextTick(() => this.$refs.treeView && this.$refs.treeView.updateFocus());
        },
    },
};
</script>
