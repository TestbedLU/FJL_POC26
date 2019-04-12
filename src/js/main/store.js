import 'babel-polyfill';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {init} from './actions';
import reducer from './reducer';


export default _ => {
	const store = createStore(reducer, undefined, applyMiddleware(thunkMiddleware));

	store.dispatch(init);

	return store;
}
