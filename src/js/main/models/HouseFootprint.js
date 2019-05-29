export default class HouseFootprint{
	constructor(objTxt, metersPerLon){
		this.dims = objTxt === undefined ? undefined : parser(objTxt);
		this.metersPerLon = metersPerLon;
	}
}

const parser = objTxt => {
	const rows = objTxt.split('\r\n');
	const allVertices = rows.filter(row => row.slice(0, 1) === 'v');
	const vertices = new Vertices(allVertices);

	return vertices.dims;
};

class Vertices{
	constructor(rows){
		this.vertices = this.parseRows(rows);
	}

	parseRows(rows){
		return rows.map(row => {
			const parts = row.split(' ');
			return new Vertice(parts[1], parts[3], parts[2])
		}).filter(vert => vert.z === 0);
	}

	get dims(){
		return {
			xMin: Math.min(...this.vertices.map(v => v.x)),
			yMin: Math.min(...this.vertices.map(v => v.y)),
			xMax: Math.max(...this.vertices.map(v => v.x)),
			yMax: Math.max(...this.vertices.map(v => v.y))
		};
	}
}

class Vertice{
	constructor(x, y, z){
		this.x = parseFloat(x);
		this.y = parseFloat(y);
		this.z = parseFloat(z);
	}
}