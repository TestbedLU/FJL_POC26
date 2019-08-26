import ObjMover from './ObjMover';
import {debounce} from 'icos-cp-utils';
import {getBaseUrl, getUrl} from '../backend';

const baseMaps = {
	imagery: {
		url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		maxZoom: 17.4
	},
	topo: {
		url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
		maxZoom: 18.4//19.4
	},
	osm: {
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		maxZoom: 19.4
	},
	farhult: {
		url: getBaseUrl() + 'tiles/farhult/{z}/{x}/{y}.png',
		minZoom: 15,
		maxZoom: 21,
	},
	hoganas: {
		url: getBaseUrl() + 'tiles/hoganas/{z}/{x}/{y}.png',
		minZoom: 15,
		maxZoom: 21,
	},
	lm_topowebb: {
		url: 'http://localhost:5000/topowebb/{z}/{y}/{x}.png',
		maxZoom: 19.4
	},
	lm_orto: {
		url: 'http://localhost:5000/proxy/{z}/{y}/{x}.png',
		maxZoom: 19.4
	},
};

export default class OSMB{
	constructor(options, helpers){
		const baseMap = baseMaps.hoganas;

		this.options = Object.assign({}, {
			container: 'map',
			position: { latitude: 56.1925284, longitude: 12.5858762 },
			zoom: 17.4,
			minZoom: 15,
			maxZoom: 21,
			tilt: 0,
			rotation: 0,
			fastMode: true,
			attribution: '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>'
		}, options);

		this.helpers = helpers;
		this._osmb = null;
		this._buildingWalls = null;
		this._buildingRoof = null;
		this._objMover = null;

		this.initMap(baseMap);

		this.isRotateEventEnabled = true;
		this.isTiltEventEnabled = true;
	}

	get osmb(){
		return this._osmb;
	}

	initMap(baseMap){
		// console.log("OSMB Version", OSMBuildings.VERSION);
		this._osmb = new OSMBuildings(this.options);

		this._osmb.addMapTiles(baseMap.url);

		if (!this.helpers.searchParams.has('noBuildings')) {
			this._osmb.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');
		}

		this._osmb.on('rotate', debounce(e => {
			if (this.isRotateEventEnabled) {
				this.helpers.setRotation(e.rotation);
			}
		}));

		this._osmb.on('tilt', debounce(e => {
			if (this.isTiltEventEnabled) {
				this.helpers.setTilt(e.tilt);
			}
		}));
	}

	loadParcels(parcels, allowed){
		this._osmb.addGeoJSON(parcels);
		this._osmb.addGeoJSON(allowed);
	}

	loadObj(housePosition){
		if (this._buildingWalls) this._osmb.remove(this._buildingWalls);
		if (this._buildingRoof) this._osmb.remove(this._buildingRoof);

		this._buildingWalls = this._osmb.addOBJ(
			getUrl(`buildings/${housePosition.objName}_horisontal_wall.obj`),
			housePosition.position,
			{ id: "building_walls", scale: 1, rotation: housePosition.rotation, color: 'rgb(250,250,250)'}
		);

		// No callback on 'addObj'. Wait until it is done
		const intervalId = setInterval(_=> {
			if (this._buildingWalls.metersPerLon) {
				clearInterval(intervalId);
				this.helpers.fetchObj(getUrl(`buildings/${housePosition.objName}_horisontal_wall.obj`), this._buildingWalls.metersPerLon);
			}
		}, 20);


		this._buildingRoof = this._osmb.addOBJ(
			getUrl(`buildings/${housePosition.objName}_horisontal_roof.obj`),
			housePosition.position,
			{ id: "building_roof", scale: 1, rotation: housePosition.rotation, color: 'rgb(50,50,50)'}
		);

		this._objMover = new ObjMover(this._osmb, this._buildingWalls, this._buildingRoof, this.helpers.moveHouse);
	}

	animateTiltMap(endTiltAngle, deltaAngle, timeout){
		this.isTiltEventEnabled = false;
		const initialTilt = this._osmb.getTilt();
		let tilt = initialTilt;
		const delta = endTiltAngle - initialTilt;
		const sign = Math.sign(delta);
		const adjustedDeltaAngle = sign * deltaAngle;

		const intervalId = setInterval(_ => {
			tilt += adjustedDeltaAngle;

			if ((sign > 0 && tilt > endTiltAngle) || (sign < 0 && tilt < endTiltAngle)) {
				clearInterval(intervalId);
				this.helpers.setTilt(endTiltAngle);
				setTimeout(_ => this.isTiltEventEnabled = true, 400);
			} else {
				this._osmb.setTilt(tilt);
			}
		}, timeout);
	}

	animateRotateMap(endRotationAngle, deltaAngle, timeout){
		this.isRotateEventEnabled = false;
		const initialRotation = this._osmb.getRotation();
		let rotation = initialRotation;
		const deltaRotation = endRotationAngle - rotation;
		const minDeltaRotation = deltaRotation > 180
			? -90
			: deltaRotation < -180
				? 90
				: deltaRotation;
		const sign = Math.sign(minDeltaRotation);
		const adjustedDeltaAngle = sign * deltaAngle;
		const adjustedEndRotationAngle = initialRotation + minDeltaRotation;

		const intervalId = setInterval(_ => {
			rotation += adjustedDeltaAngle;

			if ((adjustedDeltaAngle > 0 && rotation > adjustedEndRotationAngle) || (adjustedDeltaAngle < 0 && rotation < adjustedEndRotationAngle )) {
				clearInterval(intervalId);
				this.helpers.setRotation(endRotationAngle);
				setTimeout(_ => this.isRotateEventEnabled = true, 400);
			} else {
				this._osmb.setRotation(rotation);
			}
		}, timeout);
	}
}
