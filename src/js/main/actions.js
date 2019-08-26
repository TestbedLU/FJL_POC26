import * as Toaster from "icos-cp-toaster";
import {getObj, getJSON, getUrl, send} from './backend';
import {getParcelAttributes} from './reducer';

export const actionTypes = {
	ERROR: 'ERROR',
	INIT: 'INIT',
	TOAST: 'TOAST',
	ROTATION: 'ROTATION',
	TILT: 'TILT',
	ROTATE_HOUSE: 'ROTATE_HOUSE',
	ADD_HOUSE: 'ADD_HOUSE',
	MOVE_HOUSE: 'MOVE_HOUSE',
	FETCHED_OBJ: 'FETCHED_OBJ',
	FETCHED_BUILDING_DEFS: 'FETCHED_BUILDING_DEFS',
	FETCHED_BUILDING_META: 'FETCHED_BUILDING_META'
};

export const failWithError = error => dispatch => {
	console.log('failWithError:', error);
	dispatch ({
		type: actionTypes.ERROR,
		error
	});
};

export const init = dispatch => {
	Promise.all([getJSON(getUrl('parcels.geojson')), getJSON(getUrl('parcels_allowed.geojson'))])
		.then(([parcels, allowed]) => {
			dispatch ({
				type: actionTypes.INIT,
				parcels,
				allowed
			});
		});

	const promises = [
		getJSON(getUrl('buildings/Spira168.json')),
		getJSON(getUrl('buildings/Spira175.json')),
		getJSON(getUrl('buildings/SpiraHighRoofRidge.json'))
	];
	Promise.all(promises)
		.then((buildingAttributes) => {
			dispatch ({
				type: actionTypes.FETCHED_BUILDING_DEFS,
				buildingAttributes
			});
		});
};

export const setRotation = rotation => dispatch => {
	dispatch ({
		type: ROTATION,
		rotation
	});
};

export const setTilt = tilt => dispatch => {
	dispatch ({
		type: actionTypes.TILT,
		tilt
	});
};

export const addHouse = (objName, position) => (dispatch, getState) => {
	const {housePosition} = getState();

	if (!housePosition.isHouseAdded) {
		dispatch({
			type: actionTypes.TOAST,
			toasterData: new Toaster.ToasterData(Toaster.TOAST_INFO, 'Du kan rotera byggnaden mha den röda punkten (till vänster)'),
			autoCloseDelay: 10000
		});
	}

	dispatch ({
		type: actionTypes.ADD_HOUSE,
		objName,
		position: housePosition.isHouseAdded ? housePosition.position : position
	});
};

export const moveHouse = position => dispatch => {
	dispatch ({
		type: actionTypes.MOVE_HOUSE,
		position
	});
};

export const rotateHouse = rotation => dispatch => {
	dispatch ({
		type: actionTypes.ROTATE_HOUSE,
		rotation
	});
};

export const toast = toasterData => dispatch => {
	dispatch ({
		type: actionTypes.TOAST,
		toasterData
	});
};

export const fetchObj = (url, metersPerLon) => dispatch => {
	getObj(url).then(objTxt => {
		dispatch ({
			type: actionTypes.FETCHED_OBJ,
			objTxt,
			metersPerLon
		});
	});
};

export const fetchBuildingMeta = url => dispatch => {
	getJSON(url).then(buildingMeta => {
		dispatch ({
			type: actionTypes.FETCHED_BUILDING_META,
			buildingMeta
		});
	});
};

export const submitApplication = _ => (dispatch, getState) => {
	const {housePosition, pip, buildingAttributes} = getState();
	const houseAttributes = buildingAttributes.getAttributes(housePosition.objName);
	const parcelAttributes = getParcelAttributes(housePosition, pip);

	const submitData = {
		husID: houseAttributes.husID,
		position: housePosition.position,
		rotation: housePosition.rotation,
		fastighet: parcelAttributes.name
	};

	send(submitData).then(response => {
		console.log('Submit success:', submitData);

		dispatch({
			type: actionTypes.TOAST,
			toasterData: new Toaster.ToasterData(Toaster.TOAST_INFO, 'Din ansökan är inskickad'),
			autoCloseDelay: 15000
		})
	});
};
