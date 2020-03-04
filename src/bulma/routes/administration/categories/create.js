const CategoryCreate = () => import('../../../pages/administration/categories/Create.vue');

export default {
    name: 'administration.categories.create',
    path: 'create',
    component: CategoryCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Category',
    },
};
