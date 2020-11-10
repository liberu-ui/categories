import routeImporter from '@ui/modules/importers/routeImporter';

const routes = routeImporter(require.context('./administration', false, /.*\.js$/));

export default {
    path: '/administration',
    children: routes,
};
