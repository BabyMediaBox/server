require('../sass/remote.scss');
require('bootstrap');

import Vue from "vue";
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

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

new Vue({
    el: '#app',
    router: router
});