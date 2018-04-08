require('../sass/remote.scss');
require('bootstrap');

import Vue from "vue";
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.use(VueRouter);

import Dashboard from './remote/pages/Dashboard.vue';
import Store from "./remote/store";

import IO from 'socket.io-client';

let socket = IO();
window.Socket = socket;

const routes = [
    { path: "/", component: Dashboard}
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    store: Store,
    router: router
});