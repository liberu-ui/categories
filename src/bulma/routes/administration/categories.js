const CategoryIndex = () => import('../../pages/administration/categories/Index.vue');

export default {
    name: 'administration.categories.index',
    path: 'categories',
    component: CategoryIndex,
    meta: {
        breadcrumb: 'categories',
        title: 'Categories',
    },
};
