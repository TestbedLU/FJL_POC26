import classifyPoint from 'robust-point-in-polygon';

// classifyPoint(polygon, point) === -1 -> inside
// classifyPoint(polygon, point) === 0 -> on the boundary
// classifyPoint(polygon, point) === 1 -> outside

export default class PIP {
	constructor(geometry, attributes){
		this.geometry = geometry || [];
		this.attributes = attributes || [];
	}

	isValidPoint(point){
		return this.geometry
			.flatMap(geometry => geometry.map(polygon => classifyPoint(polygon, point)))
			.filter(result => result === -1)
			.length > 0;
	}

	isValidCorners(corners){
		return corners.map(point =>
				this.geometry.flatMap(geometry => geometry.map(polygon => classifyPoint(polygon, point)))
			)
			.map(r => r.indexOf(-1))
			.every((val, idx, arr) => val >= 0 && val === arr[0]);
	}

	getAttributes(point){
		const idx = this.geometry
			.flatMap(geometry => geometry.map(polygon => classifyPoint(polygon, point)))
			.indexOf(-1);

		return this.attributes[idx];
	}
}