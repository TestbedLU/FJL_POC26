import ObjMover from './ObjMover';

const tiles = {
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
};

export default class OSMB{
	constructor(options){
		const tile = tiles.topo;

		this.options = Object.assign({}, {
			container: 'map',
			// position: { latitude: 55.7281347, longitude: 13.19019 },
			position: { latitude: 56.2261568, longitude: 12.7270405 },
			// zoom: 17.4,
			zoom: 18.2,
			minZoom: 10,
			maxZoom: 20.2,
			tilt: 0,
			rotation: 0,
			fastMode: true,
			attribution: '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>'
		}, options);

		this._osmb = null;
		this._buildingWalls = null;
		this._buildingRoof = null;
		this._objMover = null;

		this.initMap(tile);
	}

	get osmb(){
		return this._osmb;
	}

	initMap(tile){
		console.log("Version", OSMBuildings.VERSION);
		this._osmb = new OSMBuildings(this.options);
		// this._osmb.setDate(new Date());
		let mapTiles = this._osmb.addMapTiles(tile.url);
		// this._osmb.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');

		this._osmb.on('zoom', e => {
			console.log("zoom", e.zoom);
			if (e.zoom <= tile.maxZoom && mapTiles === undefined){
				console.log("adding tiles");
				mapTiles = this._osmb.addMapTiles(tile.url);
			} else if (e.zoom > tile.maxZoom && mapTiles !== undefined){
				console.log("removing tiles");
				this._osmb.remove(mapTiles);
				mapTiles = undefined;
			}
		});
	}

	loadObj(objName){
		if (this._buildingWalls) this._osmb.remove(this._buildingWalls);
		if (this._buildingRoof) this._osmb.remove(this._buildingRoof);

		this._buildingWalls = this._osmb.addOBJ(
			getUrl(objName + '_walls.obj'),
			this.options.position,
			{ id: "building_walls", scale: 1, rotation: 0, color: 'rgb(250,250,250)'}
		);

		this._buildingRoof = this._osmb.addOBJ(
			getUrl(objName + '_roof.obj'),
			this.options.position,
			{ id: "building_roof", scale: 1, rotation: 0, color: 'rgb(50,50,50)'}
		);

		this._objMover = new ObjMover(this._osmb, this._buildingWalls, this._buildingRoof);
	}

	animateTiltMap(endTiltAngle, deltaAngle, timeout){
		const initialTilt = this._osmb.getTilt();
		let tilt = initialTilt;
		const delta = endTiltAngle - initialTilt;
		const sign = Math.sign(delta);
		const adjustedDeltaAngle = sign * deltaAngle;

		const intervalId = setInterval(_ => {
			tilt += adjustedDeltaAngle;

			if ((sign > 0 && tilt > endTiltAngle) || (sign < 0 && tilt < endTiltAngle)) {
				clearInterval(intervalId);
			} else {
				this._osmb.setTilt(tilt);
			}
		}, timeout);
	}

	animateRotateMap(endRotationAngle, deltaAngle, timeout){
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
			} else {
				this._osmb.setRotation(rotation);
			}
		}, timeout);
	}
}

const getUrl = objFile => {
	const urlParts = location.href.split('/');
	return urlParts.slice(-1)[0].length
		? urlParts.slice(0, -1).join('/') + '/' + objFile
		: urlParts.join('/') + objFile;
};
