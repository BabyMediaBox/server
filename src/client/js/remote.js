require('../sass/remote.scss');
require('bootstrap');

import Vue from "vue";
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import i18n from "./remote/i18n";

Vue.use(VueResource);
Vue.use(VueRouter);

import Dashboard from './remote/pages/Dashboard.vue';
import Playlists from './remote/pages/Playlists.vue';
import Examples from './remote/pages/Examples.vue';
import Videos from './remote/pages/Videos.vue';

import IO from 'socket.io-client';

let socket = IO();
window.Socket = socket;


const routes = [
    { path: "/", component: Dashboard},
    { path: "/playlists", component: Playlists},
    { path: "/videos", component: Videos},
    { path: "/examples", component: Examples }
];

const router = new VueRouter({
    routes
});

import App from './remote/App.vue';

new Vue({
    el: '#app',
    i18n,
    router: router,
    template: '<App/>',
    components: { App }
});