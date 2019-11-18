import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from 'lodash';
import GeneralLocale from './../locale/general';
import RemoteLocale from './../locale/remote';

Vue.use(VueI18n);

let messages = _.merge({}, RemoteLocale, GeneralLocale);

const i18n = new VueI18n({
	locale: 'bg',
	fallbackLocale: 'en',
	messages
});

export default i18n;