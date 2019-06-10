import React, { Component, Fragment } from 'react';


export default class HousePositionPanel extends Component {
	constructor(props) {
		super(props);
	}

	render(){
		const {show, isValidPosition, isValidArea, isValidBuildingHeight, isValidRidgeHeight} = this.props;

		return (
			<Content
				show={show}
				isValidPosition={isValidPosition}
				isValidArea={isValidArea}
				isValidBuildingHeight={isValidBuildingHeight}
				isValidRidgeHeight={isValidRidgeHeight}
			/>
		);
	}
}

const Content = ({show, isValidPosition, isValidArea, isValidBuildingHeight, isValidRidgeHeight}) => {
	if (!show) return null;

	const style = {
		position:'absolute',
		backgroundColor: 'white',
		padding: '2px 5px',
		zIndex: 9999,
		maxWidth: 300,
		top: 200,
		left: 25,
		borderRadius: 3
	};

	return (
		<div style={style}>
			<PositionContent isOk={isValidPosition} />
			<AreaContent isOk={isValidArea} />
			<HeightBuildingContent isOk={isValidBuildingHeight} />
			<HeightRidgeContent isOk={isValidRidgeHeight} />
		</div>
	);
};

const PositionContent = ({isOk}) => {
	const txt = isOk
		? "Positionen är OK"
		: "Byggnaden ej inom tillåtet område";

	return <Row isOk={isOk} txt={txt} />;
};

const AreaContent = ({isOk}) => {
	const txt = isOk
		? "Byggnadsarea är OK"
		: "Byggnaden är för stor";

	return <Row isOk={isOk} txt={txt} />;
};

const HeightBuildingContent = ({isOk}) => {
	const txt = isOk
		? "Byggnadshöjd är OK"
		: "Byggnadshöjd är för stor";

	return <Row isOk={isOk} txt={txt} />;
};

const HeightRidgeContent = ({isOk}) => {
	const txt = isOk
		? "Nockhöjd är OK"
		: "Byggnadens nock är för hög";

	return <Row isOk={isOk} txt={txt} />;
};

const Row = ({isOk, txt}) => {
	if (isOk === undefined) return null;

	const cls = isOk
		? "glyphicon glyphicon-ok-sign text-success"
		: "glyphicon glyphicon-remove-sign text-danger";

	return (
		<div style={{margin: '3px 0'}}>
			<span className={cls} style={{marginRight: 5}} />{txt}
		</div>
	);
};
