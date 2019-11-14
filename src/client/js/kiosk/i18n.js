import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
	'bg': {
		dashboard : {
			video_player: 'Музика',
			game: "Игра"
		}
	}
};

const i18n = new VueI18n({
	locale: 'bg',
	fallbackLocale: 'en',
	messages
});

export default i18n;