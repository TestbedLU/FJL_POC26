import {ERROR, INIT, TOAST, ROTATION, TILT, ROTATE_HOUSE, ADD_HOUSE, MOVE_HOUSE, FETCHED_OBJ,
	FETCHED_BUILDING_META, FETCHED_BUILDING_DEFS} from './actions';
import * as Toaster from 'icos-cp-toaster';
import HousePosition from "./models/HousePosition";
import HouseFootprint from "./models/HouseFootprint";
import PIP from "./models/PIP";
import BuildingAttributes from "./models/BuildingAttributes";

const initState = {
	toasterData: undefined,
	autoCloseDelay: undefined,
	searchParams: new URLSearchParams(location.search),
	parcels: undefined,
	allowed: undefined,
	pip: new PIP(),
	buildingAttributes: new BuildingAttributes(),
	rotationAngle: undefined,
	tiltAngle: undefined,
	housePosition: new HousePosition(),
	houseValidation: {},
	houseRotation: 0,
	isHouseAdded: false,
	houseFootprint: undefined,
	buildingMeta: undefined
};

let housePosition;

export default (state = initState, action) => {

	switch(action.type){

		case ERROR:
			return update({
				toasterData: new Toaster.ToasterData(Toaster.TOAST_ERROR, action.error.message.split('\n')[0])
			});

		case INIT:
			const parcels = updateParcels(action.parcels);

			return update({
				parcels,
				allowed: updateAllowed(action.allowed),
				pip: new PIP(getGeometry(action.allowed), getAttributes(parcels))
			});

		case ROTATION:
			return update({
				rotationAngle: action.rotation
			});

		case TILT:
			return update({
				tiltAngle: action.tilt
			});

		case ADD_HOUSE:
			return update({
				isHouseAdded: true,
				housePosition: state.housePosition.addHouse(action.objName, action.position, state.housePosition.rotation)
			});

		case MOVE_HOUSE:
			housePosition = state.housePosition.moveHouse(action.position);

			return update({
				housePosition,
				houseValidation: validateHouse(housePosition, state.pip, state.buildingAttributes)
			});

		case ROTATE_HOUSE:
			housePosition = state.housePosition.withRotation(action.rotation);

			return update({
				houseRotation: action.rotation,
				housePosition,
				houseValidation: validateHouse(housePosition, state.pip, state.buildingAttributes)
			});

		case FETCHED_OBJ:
			housePosition = state.housePosition.withFootprint(new HouseFootprint(action.objTxt, action.metersPerLon));

			return update({
				housePosition,
				houseValidation: validateHouse(housePosition, state.pip, state.buildingAttributes)
			});

		case FETCHED_BUILDING_META:
			return update({
				buildingMeta: action.buildingMeta
			});

		case FETCHED_BUILDING_DEFS:
			return update({
				buildingAttributes: new BuildingAttributes(action.buildingAttributes)
			});

		case TOAST:
			return update({
				toasterData: action.toasterData,
				autoCloseDelay: action.autoCloseDelay
			});

		default:
			return state;
	}

	function update() {
		return Object.assign.apply(Object, [{}, state].concat(...arguments));
	}
}

const validateHouse = (housePosition, pip, buildingAttributes) => {
	const parcelAttributes = getParcelAttributes(housePosition, pip);
	const houseAttributes = buildingAttributes.getAttributes(housePosition.objName);

	const isValidPosition = validatePosition(housePosition, pip);
	const isValidArea = !isValidPosition || parcelAttributes === undefined
		? undefined
		: houseAttributes.egenskaper.byggnadsArea / parcelAttributes.area < 0.3;
	const isValidBuildingHeight = !isValidPosition || parcelAttributes === undefined
		? undefined
		: houseAttributes.egenskaper.byggnadsHojd < parcelAttributes.maxByggHojd;
	const isValidRidgeHeight = !isValidPosition || parcelAttributes === undefined
		? undefined
		: houseAttributes.egenskaper.nockHojd < parcelAttributes.maxNockHojd;

	// console.log({parcelAttributes, houseAttributes, housePosition, pip});

	return {
		isValidPosition,
		isValidArea,
		isValidBuildingHeight,
		isValidRidgeHeight
	};
};

export const getParcelAttributes = (housePosition, pip) => {
	const position = housePosition.position;
	const centerPoint = [position.longitude, position.latitude];
	return pip.getAttributes(centerPoint);
};

const validatePosition = (housePosition, pip) => {
	const houseCorners = housePosition.getCorners();
	return pip.isValidCorners(houseCorners);
};

const updateParcels = parcels => {
	return Object.assign({}, parcels, {features: parcels.features.map(feature => {
			return Object.assign({}, feature, {
				properties: Object.assign(feature.properties, {
					roofColor: "#ff7b68",
					height: 0,
					area: parseFloat(feature.properties.area),
					maxByggHojd: parseFloat(feature.properties.maxByggHojd),
					maxNockHojd: parseFloat(feature.properties.maxNockHojd)
				})
			})
		})}
	);
};

const updateAllowed = parcels_allowed => {
	return Object.assign({}, parcels_allowed, {features: parcels_allowed.features.map(f => {
			return Object.assign({}, f, {
				properties: Object.assign(f.properties, {
					roofColor: "#7FFF79",
					height: 0.05
				})
			})
		})}
	);
};

const getGeometry = featureCollection => {
	return featureCollection.features.map(feature => feature.geometry.coordinates);
};

const getAttributes = featureCollection => {
	return featureCollection.features.map(feature => {
		const obj = Object.assign({}, feature.properties);
		delete obj.roofColor;
		delete obj.height;

		return obj;
	});
};
