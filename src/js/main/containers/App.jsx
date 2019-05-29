import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { AnimatedToasters } from 'icos-cp-toaster';
import {failWithError, toast, setRotation, setTilt, rotateHouse, addHouse, moveHouse, fetchObj,
	fetchBuildingMeta, submitApplication} from '../actions';
import Map from '../components/Map.jsx';


export class App extends Component {
	constructor(props){
		super(props);
	}

	render(){
		const {toasterData, autoCloseDelay} = this.props;
		const mapProps = filterProps(this.props);

		return (
			<Fragment>
				<AnimatedToasters
					autoCloseDelay={autoCloseDelay || 5000}
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

const excludedProps = ['failWithError', 'toasterData', 'autoCloseDelay'];
const filterProps = props => {
	return Object.entries(props)
		.filter(arr => !excludedProps.includes(arr[0]))
		.reduce((acc, arr) => {
			acc[arr[0]] = arr[1];
			return acc;
		}, {});
};

const stateToProps = state => {
	return state;
};

const dispatchToProps = dispatch => {
	return {
		failWithError: error => dispatch(failWithError(error)),
		setRotation: rotation => dispatch(setRotation(rotation)),
		setTilt: tilt => dispatch(setTilt(tilt)),
		fetchObj: (url, metersPerLon) => dispatch(fetchObj(url, metersPerLon)),
		fetchBuildingMeta: url => dispatch(fetchBuildingMeta(url)),
		rotateHouse: rotation => dispatch(rotateHouse(rotation)),
		moveHouse: position => dispatch(moveHouse(position)),
		submitApplication: _ => dispatch(submitApplication()),
		addHouse: (objName, position) => dispatch(addHouse(objName, position)),
		toast: toasterData => dispatch(toast(toasterData))
	};
};

export default connect(stateToProps, dispatchToProps)(App);
