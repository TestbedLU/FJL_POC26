import React, { Component } from 'react';
import OSMB from '../models/OSMB';
import NavigationTools, {navigation} from "./NavigationTools.jsx";


export default class Map extends Component{
	constructor(props){
		super(props);

		const searchParams = props.searchParams;
		let options = {};
		if (searchParams.has('latitude') && searchParams.has('longitude')){
			options.position = {
				latitude: parseFloat(searchParams.get('latitude')),
				longitude: parseFloat(searchParams.get('longitude'))
			};
		}
		if (searchParams.has('zoom')){
			options.zoom = parseFloat(searchParams.get('zoom'));
		}
		if (searchParams.has('tilt')){
			options.tilt = parseInt(searchParams.get('tilt'));
		}
		if (searchParams.has('view') && searchParams.get('view') in navigation){
			options.rotation = navigation[searchParams.get('view')].angle;
			this.initialOrientation = searchParams.get('view');
		}

		this.map = new OSMB(options);
	}

	rotate(endRotationAngle){
		this.map.animateRotateMap(endRotationAngle, 1, 10);
	}

	tilt(tiltAngle){
		this.map.animateTiltMap(tiltAngle, 1, 10);
	}

	building(objName){
		this.map.loadObj(objName);
	}

	render(){
		return (
			<NavigationTools
				initialOrientation={this.initialOrientation}
				rotate={this.rotate.bind(this)}
				tilt={this.tilt.bind(this)}
				building={this.building.bind(this)}
			/>
		);
	}
}
