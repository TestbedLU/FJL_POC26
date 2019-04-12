import {ERROR, INIT, TOAST} from './actions';
import * as Toaster from 'icos-cp-toaster';

const initState = {
	searchParams: new URLSearchParams(location.search)
};


export default (state = initState, action) => {

	switch(action.type){

		case ERROR:
			return update({
				toasterData: new Toaster.ToasterData(Toaster.TOAST_ERROR, action.error.message.split('\n')[0])
			});

		case INIT:
			return state;

		case TOAST:
			return update({
				toasterData: action.toasterData
			});

		default:
			return state;
	}

	function update() {
		const updates = Array.from(arguments);
		return Object.assign.apply(Object, [{}, state].concat(updates));
	}
}
