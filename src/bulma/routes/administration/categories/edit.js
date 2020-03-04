const CategoryEdit = () => import('../../../pages/administration/categories/Edit.vue');

export default {
    name: 'administration.categories.edit',
    path: ':category/edit',
    component: CategoryEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Category',
    },
};
