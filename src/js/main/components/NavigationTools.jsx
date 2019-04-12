import React, { Component } from 'react';
import './NavigationTools.css';
import Dropdown from './Dropdown.jsx';

export const navigation = {
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

const tiltAngels = {
	0: "0 grader",
	10: "10 grader",
	20: "20 grader",
	30: "30 grader",
	40: "40 grader",
	50: "50 grader"
};

const buildings = {
	Spira168: 'Spira168',
	Spira175: 'Spira175'
};


export default class NavigationTools extends Component{
	constructor(props){
		super(props);

		this.rotate = props.rotate;
		this.tilt = props.tilt;
		this.building = props.building;

		this.state = {
			activeOrientation: props.initialOrientation || 'south',
			selectedTilt: undefined,
			selectedBuilding: undefined
		}
	}

	handleArrowClick(orientation){
		this.setState({activeOrientation: orientation});
		this.rotate(navigation[orientation].angle);
	}

	handleTiltClick(angle){
		const tiltAngle = parseInt(angle);
		this.setState({selectedTilt: tiltAngle});
		this.tilt(tiltAngle);
	}

	handleBuildingClick(objName){
		this.setState({selectedBuilding: objName});
		this.building(objName);
	}

	render(){
		const {selectedTilt, selectedBuilding} = this.state;

		return (
			<div id="navigationTools">
				<span id="arrows">
					<Arrow self={this} orientation={'north'} />
					<Arrow self={this} orientation={'east'} />
					<Arrow self={this} orientation={'south'} />
					<Arrow self={this} orientation={'west'} />
				</span>

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
