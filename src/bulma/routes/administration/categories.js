import routeImporter from '@core/modules/importers/routeImporter';

const routes = routeImporter(require.context('./categories', false, /.*\.js$/));
const RouterView = () => import('@core/bulma/pages/Router.vue');

export default {
    path: 'categories',
    component: RouterView,
    meta: {
        breadcrumb: 'categories',
        route: 'administration.categories.index',
    },
    children: routes,
};
