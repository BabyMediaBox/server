let messages = {
	'bg' : {
		buttons: {
			gameButton: 'За игра'
		}
	}
};

messages['bg']['buttons'][__Config__.upButton] = 'Нагоре';
messages['bg']['buttons'][__Config__.downButton] = 'Надолу';
messages['bg']['buttons'][__Config__.selectButton] = 'Избор';
messages['bg']['buttons'][__Config__.dashboardButton] = 'Начало';

export default messages;