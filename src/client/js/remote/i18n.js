import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
	'bg': {
		buttons: {
			gameButton: 'За игра'
		}
	}
};
messages['bg']['buttons'][__Config__.upButton] = 'Нагоре';
messages['bg']['buttons'][__Config__.downButton] = 'Надолу';
messages['bg']['buttons'][__Config__.selectButton] = 'Избор';
messages['bg']['buttons'][__Config__.dashboardButton] = 'Начало';

const i18n = new VueI18n({
	locale: 'bg',
	fallbackLocale: 'en',
	messages
});

export default i18n;