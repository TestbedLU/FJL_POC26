import L from 'leaflet';
import T from 'tangram';
import '../../node_modules/leaflet/dist/leaflet.css';

export default class Tangram {
	constructor(){
		const map = L.map('map');
d
		const tangramLayer = T.leafletLayer({
			scene: 'scene.yaml',
			attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors'
		});

		tangramLayer.addTo(map);

		map.setView([55.7281347, 13.19019], 19);
	}
}