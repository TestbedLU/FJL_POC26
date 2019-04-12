import React, { Component } from 'react'
import { Provider } from 'react-redux'
import getStore from '../store.js';
import App from './App.jsx';


export default class Root extends Component {
	render() {
		return (
			<Provider store={getStore()}>
				<App />
			</Provider>
		);
	}
}