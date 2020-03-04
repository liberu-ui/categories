const CategoryShow = () => import('../../../pages/administration/categories/Show.vue');

export default {
    name: 'administration.categories.show',
    path: ':category',
    component: CategoryShow,
    meta: {
        breadcrumb: 'show',
        title: 'Show Category',
    },
};
