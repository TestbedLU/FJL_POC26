import React, { Component } from 'react';
import './NavigationTools.css';
import Dropdown from './Dropdown.jsx';
import HouseRotation from './HouseRotation.jsx';

const navigation = {
	north: {
		angle: 180,
		className: 'fas fa-arrow-down',
		style: {left: 30}
	},
	east: {
		angle: 270,
		className: 'fas fa-arrow-left',
		style: {left: 60, top: 30}
	},
	south: {
		angle: 0,
		className: 'fas fa-arrow-up',
		style: {left: 30, top: 60}
	},
	west: {
		angle: 90,
		className: 'fas fa-arrow-right',
		style: {left: 0, top: 30}
	}
};

const findOrientation = (rotation = 0) => {
	return Object.keys(navigation)
		.find(key => navigation[key].angle === rotation);
};

const tiltAngels = {
	0: "0 grader",
	15: "15 grader",
	30: "30 grader",
	45: "45 grader"
};

const isDefinedTilt = tiltAngle => {
	return Object.keys(tiltAngels).map(a => parseInt(a)).includes(tiltAngle);
};

const buildings = {
	Spira168: 'Spira168',
	Spira175: 'Spira175',
	SpiraHighRoofRidge: 'Spira High Roof',
};


export default class NavigationTools extends Component{
	constructor(props){
		super(props);

		this.rotate = props.rotate;
		this.tilt = props.tilt;
		this.addHouse = props.addHouse;

		this.state = {
			activeOrientation: props.initialOrientation || 'south',
			selectedTilt: undefined,
			selectedBuilding: undefined
		};
	}

	componentWillReceiveProps(nextProps, nextContext) {
		const newActiveOrientation = findOrientation(nextProps.rotationAngle);
		const newSelectedTilt = nextProps.tiltAngle === undefined
			? 0
			: isDefinedTilt(nextProps.tiltAngle) ? nextProps.tiltAngle : undefined;

		this.setState({
			activeOrientation: newActiveOrientation,
			selectedTilt: newSelectedTilt
		});
	}

	handleArrowClick(orientation){
		this.setState({activeOrientation: orientation});
		this.rotate(navigation[orientation].angle);
	}

	handleTiltClick(angle){
		const selectedTilt = parseInt(angle);
		this.setState({selectedTilt});
		this.tilt(selectedTilt);
	}

	handleBuildingClick(objName){
		this.setState({selectedBuilding: objName});
		this.addHouse(objName);
	}

	render(){
		const {selectedTilt, selectedBuilding} = this.state;
		const {rotateHouse, isHouseAdded, houseRotation} = this.props;

		return (
			<div id="navigationTools">
				<span id="arrows">
					<Arrow self={this} orientation={'north'} />
					<Arrow self={this} orientation={'east'} />
					<Arrow self={this} orientation={'south'} />
					<Arrow self={this} orientation={'west'} />
				</span>

				<HouseRotation
					rotateHouse={rotateHouse}
					isHouseAdded={isHouseAdded}
					houseRotation={houseRotation}
				/>

				<span id="tilt">
					<Dropdown
						isEnabled={true}
						lookup={tiltAngels}
						defaultLbl="Lutning"
						itemClickAction={this.handleTiltClick.bind(this)}
						selectedItemKey={selectedTilt}
					/>
				</span>

				<span id="building">
					<Dropdown
						isEnabled={true}
						lookup={buildings}
						defaultLbl="Byggnad"
						itemClickAction={this.handleBuildingClick.bind(this)}
						selectedItemKey={selectedBuilding}
					/>
				</span>
			</div>
		);
	}
}

const Arrow = ({self, orientation}) => (
	<i
		className={getClassName(orientation, self.state.activeOrientation)}
		title={"View from " + orientation}
		style={navigation[orientation].style}
		onClick={self.handleArrowClick.bind(self, orientation)}
	/>
);

const getClassName = (orientation, activeOrientation) => {
	return orientation === activeOrientation
		? navigation[orientation].className + ' active'
		: navigation[orientation].className;
};
