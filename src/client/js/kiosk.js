require('../sass/kiosk.scss');
require('bootstrap');

import Vue from "vue";
import App from './kiosk/player.vue';

import IO from 'socket.io-client';

let socket = IO();
window.Socket = socket;

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});