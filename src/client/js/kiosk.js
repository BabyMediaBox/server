require('../sass/kiosk.scss');
require('bootstrap');

import Vue from "vue";
import VueResource from 'vue-resource';
import App from './kiosk/player.vue';

Vue.use(VueResource);
import IO from 'socket.io-client';

let socket = IO();
window.Socket = socket;

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});