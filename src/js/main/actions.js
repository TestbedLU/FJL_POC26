export const ERROR = 'ERROR';
export const INIT = 'INIT';
export const TOAST = 'TOAST';

export const failWithError = error => dispatch => {
	console.log('failWithError:', error);
	dispatch ({
		type: ERROR,
		error
	});
};

export const init = dispatch => {

};

export const toast = toasterData => dispatch => {
	dispatch ({
		type: TOAST,
		toasterData
	});
};
