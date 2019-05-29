import * as Toaster from "icos-cp-toaster";
import {getObj, getJSON, getUrl, send} from './backend';
import {getParcelAttributes} from './reducer';

export const ERROR = 'ERROR';
export const INIT = 'INIT';
export const TOAST = 'TOAST';
export const ROTATION = 'ROTATION';
export const TILT = 'TILT';
export const ROTATE_HOUSE = 'ROTATE_HOUSE';
export const ADD_HOUSE = 'ADD_HOUSE';
export const MOVE_HOUSE = 'MOVE_HOUSE';
export const FETCHED_OBJ = 'FETCHED_OBJ';
export const FETCHED_BUILDING_DEFS = 'FETCHED_BUILDING_DEFS';
export const FETCHED_BUILDING_META = 'FETCHED_BUILDING_META';

export const failWithError = error => dispatch => {
	console.log('failWithError:', error);
	dispatch ({
		type: ERROR,
		error
	});
};

export const init = dispatch => {
	Promise.all([getJSON(getUrl('parcels.geojson')), getJSON(getUrl('parcels_allowed.geojson'))])
		.then(([parcels, allowed]) => {
			dispatch ({
				type: INIT,
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
				type: FETCHED_BUILDING_DEFS,
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
		type: TILT,
		tilt
	});
};

export const addHouse = (objName, position) => (dispatch, getState) => {
	const {housePosition} = getState();

	if (!housePosition.isHouseAdded) {
		dispatch({
			type: TOAST,
			toasterData: new Toaster.ToasterData(Toaster.TOAST_INFO, 'Du kan rotera byggnaden mha den röda punkten (till vänster)'),
			autoCloseDelay: 10000
		});
	}

	dispatch ({
		type: ADD_HOUSE,
		objName,
		position: housePosition.isHouseAdded ? housePosition.position : position
	});
};

export const moveHouse = position => dispatch => {
	dispatch ({
		type: MOVE_HOUSE,
		position
	});
};

export const rotateHouse = rotation => dispatch => {
	dispatch ({
		type: ROTATE_HOUSE,
		rotation
	});
};

export const toast = toasterData => dispatch => {
	dispatch ({
		type: TOAST,
		toasterData
	});
};

export const fetchObj = (url, metersPerLon) => dispatch => {
	getObj(url).then(objTxt => {
		dispatch ({
			type: FETCHED_OBJ,
			objTxt,
			metersPerLon
		});
	});
};

export const fetchBuildingMeta = url => dispatch => {
	getJSON(url).then(buildingMeta => {
		dispatch ({
			type: FETCHED_BUILDING_META,
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
			type: TOAST,
			toasterData: new Toaster.ToasterData(Toaster.TOAST_INFO, 'Din ansökan är inskickad'),
			autoCloseDelay: 15000
		})
	});
};
