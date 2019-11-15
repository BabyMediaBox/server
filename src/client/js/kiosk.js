require('../sass/kiosk.scss');
require('bootstrap');

import Vue from "vue";
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import i18n from "./kiosk/i18n";
import App from './kiosk/App.vue';
import Dashboard from './kiosk/Dashboard.vue';
import Player from './kiosk/Player.vue';
import Game from './kiosk/Game.vue';
import GameShapes from './kiosk/games/shapes';

Vue.use(VueResource);
Vue.use(VueRouter);

import IO from 'socket.io-client';

let socket = IO();
window.Socket = socket;

Vue.config.productionTip = false;

const routes = [
    { path : '/', component: Dashboard},
    { path : '/play', component: Player},
    { path : '/game', component: Game },
    { path : '/playgame/shapes', component: GameShapes },
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    i18n,
    router: router,
    template: '<App/>',
    components: { App }
});