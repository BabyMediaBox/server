require('../sass/manager.scss');
require('bootstrap');

import Vue from "vue";
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.use(VueRouter);

import Dashboard from './manager/pages/Dashboard.vue';
import Playlists from './manager/pages/Playlists.vue';
import EditPlaylist from './manager/pages/EditPlaylist.vue';

const routes = [
    { path: "/", component: Dashboard},
    { path: "/playlists", component: Playlists},
    { path: "/edit/playlist/:file", component: EditPlaylist, name: 'EditPlaylist'}
];

const router = new VueRouter({
    routes
});

import App from './manager/App.vue';

new Vue({
    el: '#app',
    router: router,
    template: '<App/>',
    components: { App }
});