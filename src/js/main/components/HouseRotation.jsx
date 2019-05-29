import React, { Component, Fragment } from 'react';
import {debounce, throttle} from 'icos-cp-utils';

export default class HouseRotation extends Component{
	constructor(props){
		super(props);

		this.centerXY = {
			x: undefined,
			y: undefined
		};

		this.footprint = undefined;
		this.footprints = [];
		this.isGrabbingDot = false;
		this.rotationAngle = 0;
		document.addEventListener('mousemove', this.onMouseMove.bind(this));
		document.addEventListener('mouseup', this.onMouseUp.bind(this));
	}

	componentDidUpdate(nextProps, nextContext) {
		const {housePosition} = nextProps.houseRotation;

		if (housePosition.footPrintCornerData ) {
			this.updateFootprint()
		}
	}

	onMouseOver(sender){
		sender.target.style.cursor = 'grabbing';
	}

	onMouseOut(sender){
		sender.target.style.cursor = 'default';
	}

	onMouseDown(){
		this.isGrabbingDot = true;
	}

	onMouseMove(sender){
		if (this.isGrabbingDot) {
			this.rotationAngle = getNewAngle(sender, this.centerXY);
			this.houseRotateDot.style.transform = `rotate(${this.rotationAngle}deg) translateY(-30px)`;

			throttle(this.updateFootprint(), 100);
			// this.updateFootprint();
		}
	}

	onMouseUp(){
		if (this.isGrabbingDot) {
			this.isGrabbingDot = false;
			this.props.rotateHouse(this.rotationAngle);
		}
	}

	updateFootprint(){
		const {remove, addGeoJSON, housePosition} = this.props.houseRotation;
		// console.log({remove, addGeoJSON, housePosition, angle: this.rotationAngle});

		// if (this.footprint) remove(this.footprint);
		this.footprints.forEach(footprint => remove(footprint));
		// this.footprint = addGeoJSON(housePosition.getGeoJson(this.rotationAngle));
		if (housePosition.hasFootprintCornerData) {
			this.footprints.push(addGeoJSON(housePosition.getGeoJson(this.rotationAngle)));
		}
	}

	render(){
		const {isHouseAdded} = this.props;
		const style = isHouseAdded
			? {}
			: {color: 'gray'};
		const onMouseOver = isHouseAdded ? this.onMouseOver : _ => _;
		const onMouseOut = isHouseAdded ? this.onMouseOut : _ => _;
		const onMouseDown = isHouseAdded ? this.onMouseDown.bind(this) : _ => _;
		const title = isHouseAdded
			? "Rotera byggnaden genom att flytta den röda punkten"
			: "Välj först en byggnad";

		return (
			<Fragment>
				<i
					ref={i => this.houseRotateCircle = i}
					id="houseRotateCircle"
					className="far fa-circle"
					style={style}
				/>
				<i
					ref={i => this.houseRotateDot = i}
					id="houseRotateDot"
					className="fas fa-circle"
					style={style}
					onMouseOver={onMouseOver}
					onMouseOut={onMouseOut}
					onMouseDown={onMouseDown}
				/>
				<i
					id="houseRotateIcon"
					className="fas fa-home"
					style={style}
					title={title}
				/>
			</Fragment>
		);
	}

	componentDidMount() {
		const clientRect = this.houseRotateCircle.getClientRects()[0];
		this.centerXY.x = clientRect.x + clientRect.width / 2;
		this.centerXY.y = clientRect.y + clientRect.height / 2;
	}
}

const getNewAngle = (sender, centerXY) => {
	const dx = sender.clientX - centerXY.x;
	const dy = sender.clientY - centerXY.y;

	let newAngle = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
	if (newAngle < 0) newAngle += 360;

	return newAngle;
};
