export default class HousePosition{
	constructor(objName, position = {}, rotation = 0, doRedraw = true, footPrint){
		this.objName = objName;
		this.latitude = position.latitude;
		this.longitude = position.longitude;
		this._rotation = rotation;
		this.doRedraw = doRedraw;

		if (footPrint && position.latitude) {
			const latRadians = this.latitude * Math.PI / 180;
			this.metersPerLat = 111132.92 - 559.82 * Math.cos(2 * latRadians) + 1.175 * Math.cos(4 * latRadians) - 0.0023 * Math.cos(6 * latRadians);

			this.footPrint = footPrint;
			this.footPrintCornerData = this.getLengthsAndAngles(footPrint);
		}
	}

	addHouse(objName, position, rotation){
		return new HousePosition(objName, position, rotation);
	}

	moveHouse(position){
		return new HousePosition(this.objName, position, this._rotation, false, this.footPrint);
	}

	withRotation(rotation){
		return new HousePosition(this.objName, this.position, rotation, true, this.footPrint);
	}

	withFootprint(footPrint){
		return new HousePosition(this.objName, this.position, this._rotation, false, footPrint);
	}

	get isHouseAdded(){
		return this.latitude !== undefined && this.longitude !== undefined;
	}

	get hasFootprint(){
		return this.footPrint !== undefined;
	}

	get hasFootprintCornerData(){
		return this.footPrintCornerData !== undefined;
	}

	get position(){
		return {
			latitude: this.latitude,
			longitude: this.longitude
		};
	}

	get rotation(){
		return this._rotation;
	}

	getLengthsAndAngles(footPrint){
		// The obj file contains dimensions in meters
		const {xMin, yMin, xMax, yMax} = footPrint.dims;
		const llDistance = Math.sqrt(Math.pow(xMin, 2) + Math.pow(yMin, 2));
		const ulDistance = Math.sqrt(Math.pow(xMin, 2) + Math.pow(yMax, 2));
		const urDistance = Math.sqrt(Math.pow(xMax, 2) + Math.pow(yMax, 2));
		const lrDistance = Math.sqrt(Math.pow(xMax, 2) + Math.pow(yMin, 2));

		const llAngle = Math.acos(Math.abs(yMin) / llDistance) + Math.PI;
		const ulAngle = 2 * Math.PI - Math.acos(yMax / ulDistance);
		const urAngle = Math.acos(yMax / urDistance);
		const lrAngle = Math.PI - (Math.acos(Math.abs(yMin) / lrDistance));

		return {
			lengthsMeters: [llDistance, ulDistance, urDistance, lrDistance],
			angles: [llAngle, ulAngle, urAngle, lrAngle]
		};
	}

	getCorners(angle = this._rotation){
		const [llDistance, ulDistance, urDistance, lrDistance] = this.footPrintCornerData.lengthsMeters;
		const [llAngle, ulAngle, urAngle, lrAngle] = this.footPrintCornerData.angles;
		const metersPerLon = this.footPrint.metersPerLon;
		const metersPerLat = this.metersPerLat;
		const rotation = - (angle + 90) * Math.PI / 180;

		return [
			[
				this.longitude + ((llDistance * Math.cos(rotation + llAngle)) / metersPerLon),
				this.latitude + ((llDistance * Math.sin(rotation + llAngle)) / metersPerLat)
			],
			[
				this.longitude + ((ulDistance * Math.cos(rotation + ulAngle)) / metersPerLon),
				this.latitude + ((ulDistance * Math.sin(rotation + ulAngle)) / metersPerLat)
			],
			[
				this.longitude + ((urDistance * Math.cos(rotation + urAngle)) / metersPerLon),
				this.latitude + ((urDistance * Math.sin(rotation + urAngle)) / metersPerLat)
			],
			[
				this.longitude + ((lrDistance * Math.cos(rotation + lrAngle)) / metersPerLon),
				this.latitude + ((lrDistance * Math.sin(rotation + lrAngle)) / metersPerLat)
			],
		];
	}

	getGeoJson(angle = this._rotation){
		const coords = this.getCorners(angle);
		const coordinates = coords.concat(coords.slice(0, 1));

		return {
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"properties": {
						"color": "#646464",
						"roofColor": "#646464",
						"height": 0.3
					},
					"geometry": {
						"type": "Polygon",
						"coordinates": [coordinates]
					}
				}
			]
		};
	}

	redrawHouse(housePosition){
		return this.doRedraw
			&& (this.objName !== housePosition.objName
			|| this.latitude !== housePosition.latitude
			|| this.longitude !== housePosition.longitude
			|| this._rotation !== housePosition.rotation);
	}
}