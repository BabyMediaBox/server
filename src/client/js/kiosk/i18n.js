import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from 'lodash';
import KioskLocale from './../locale/kiosk';
import GeneralLocale from './../locale/general';

Vue.use(VueI18n);

let messages = _.merge({}, KioskLocale, GeneralLocale);

console.log("mesasges", messages);
const i18n = new VueI18n({
	locale: 'bg',
	fallbackLocale: 'en',
	messages
});

export default i18n;