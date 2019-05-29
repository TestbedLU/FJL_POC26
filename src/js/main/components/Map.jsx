import React, { Component, Fragment } from 'react';
import OSMB from '../models/OSMB';
import NavigationTools, {navigation} from "./NavigationTools.jsx";
import ApplicationProcessing from './ApplicationProcessing.jsx';
import HousePositionPanel from './HousePositionPanel.jsx';


export default class Map extends Component{
	constructor(props){
		super(props);

		const searchParams = props.searchParams;
		this.options = {};
		if (searchParams.has('latitude') && searchParams.has('longitude')){
			this.options.position = {
				latitude: parseFloat(searchParams.get('latitude')),
				longitude: parseFloat(searchParams.get('longitude'))
			};
		}
		if (searchParams.has('zoom')){
			this.options.zoom = parseFloat(searchParams.get('zoom'));
		}
		if (searchParams.has('tilt')){
			this.options.tilt = parseInt(searchParams.get('tilt'));
		}
		if (searchParams.has('view') && searchParams.get('view') in navigation){
			this.options.rotation = navigation[searchParams.get('view')].angle;
			this.initialOrientation = searchParams.get('view');
		}

		this.helpers = {
			setRotation: props.setRotation,
			setTilt: props.setTilt,
			moveHouse: props.moveHouse,
			fetchObj: props.fetchObj,
			fetchBuildingMeta: props.fetchBuildingMeta,
			searchParams: props.searchParams,
		};

		this.objName = undefined;
	}

	rotate(endRotationAngle){
		this.map.animateRotateMap(endRotationAngle, 1, 10);
	}

	tilt(tiltAngle){
		this.map.animateTiltMap(tiltAngle, 1, 10);
	}

	addHouse(objName){
		this.props.addHouse(objName, this.map.osmb.getPosition());
	}

	componentWillReceiveProps(nextProps, nextContext) {
		const gotParcelDefs = this.props.parcels === undefined && this.props.allowed === undefined
			&& nextProps.parcels !== undefined && nextProps.allowed !== undefined;

		if (gotParcelDefs){
			this.map.loadParcels(nextProps.parcels, nextProps.allowed);
			// const point1 = [12.5840400, 56.1928013];	// Correct
			// const point2 = [12.5839542, 56.1929380];	// Incorrect
			// console.log({isValidPoint: nextProps.pip.isValidPoint(point1)});
			// console.log({isValidPoint: nextProps.pip.isValidPoint(point2)});
		}

		if (nextProps.housePosition.redrawHouse(this.props.housePosition)) {
			this.map.loadObj(nextProps.housePosition);
		}

		// const housePosition = nextProps.housePosition;
		//
		// if (housePosition && housePosition.hasFootprint) {
		// 	// console.log({housePosition});
		//
		// 	if (this.footprint) this.map.osmb.remove(this.footprint);
		// 	this.footprint = this.map.osmb.addGeoJSON(housePosition.getGeoJson());
		// }
	}

	render(){
		const {rotationAngle, tiltAngle, rotateHouse, isHouseAdded, housePosition, submitApplication} = this.props;
		const {isValidPosition, isValidArea, isValidBuildingHeight, isValidRidgeHeight} = this.props.houseValidation;
		const isReadyForProcessing = isHouseAdded && isValidPosition;
		const isApplicationOk = isHouseAdded && isValidPosition && isValidArea && isValidBuildingHeight && isValidRidgeHeight;
		const addGeoJSON = this.map ? this.map.osmb.addGeoJSON : undefined;
		const remove = this.map ? this.map.osmb.remove : undefined;
		// console.log({props: this.props, isValidPosition});

		return (
			<Fragment>
				<NavigationTools
					rotationAngle={rotationAngle}
					tiltAngle={tiltAngle}
					initialOrientation={this.initialOrientation}
					rotate={this.rotate.bind(this)}
					tilt={this.tilt.bind(this)}
					addHouse={this.addHouse.bind(this)}
					rotateHouse={rotateHouse}
					isHouseAdded={isHouseAdded}
					houseRotation={{
						addGeoJSON,
						remove,
						housePosition
					}}
				/>

				<ApplicationProcessing
					isReadyForProcessing={isReadyForProcessing}
					isApplicationOk={isApplicationOk}
					submitApplication={submitApplication}
				/>

				<HousePositionPanel
					show={isHouseAdded}
					isValidPosition={isValidPosition}
					isValidArea={isValidArea}
					isValidBuildingHeight={isValidBuildingHeight}
					isValidRidgeHeight={isValidRidgeHeight}
				/>
			</Fragment>
		);
	}

	componentDidMount() {
		const bodyHeight = document.body.clientHeight;
		const headerHeight = document.getElementById('headerRow').clientHeight;
		const mapHeight = bodyHeight - headerHeight - 15;
		document.getElementById('map').style.height = mapHeight + 'px';

		this.map = new OSMB(this.options, this.helpers);
	}
}
