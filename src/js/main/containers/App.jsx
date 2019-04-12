import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { AnimatedToasters } from 'icos-cp-toaster';
import {failWithError, toast} from '../actions';
import Map from '../components/Map.jsx';


export class App extends Component {
	constructor(props){
		super(props);
	}

	render(){
		const {toasterData, failWithError, searchParams} = this.props;
		const mapProps = {
			toast,
			searchParams
		};

		return (
			<Fragment>
				<AnimatedToasters
					autoCloseDelay={5000}
					toasterData={toasterData}
					maxWidth={400}
				/>

				<ErrorBoundary failWithError={failWithError}>
					<Map {...mapProps} />
				</ErrorBoundary>
			</Fragment>
		);
	}
}

const stateToProps = state => {
	return state;
};

const dispatchToProps = dispatch => {
	return {
		failWithError: error => dispatch(failWithError(error)),
		toast: toasterData => dispatch(toast(toasterData))
	};
};

export default connect(stateToProps, dispatchToProps)(App);
