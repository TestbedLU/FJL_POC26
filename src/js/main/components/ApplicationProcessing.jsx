import React, { Component, Fragment } from 'react';
import Draggable from 'icos-cp-draggable';
import ApplicationProcessPanels from './ApplicationProcessPanels.jsx';


export default class ApplicationProcessing extends Component{
	constructor(props){
		super(props);

		this.state = {
			isOpen: false,
			isLoggedIn: false,
			isApplicationReady: false
		};

		this.draggableStyle = undefined;

		this.processingFns = {
			login: this.handleLogin.bind(this),
			submit: this.handleSubmit.bind(this)
		};
	}

	handleLogin(){
		this.setState({isLoggedIn: true});
	}

	handleSubmit(isYes, submitApplication){
		if (submitApplication){
			this.props.submitApplication();
			this.setState({isOpen: false});
			return;
		}

		if (isYes) {
			this.setState({isApplicationReady: isYes});
			// this.props.submitApplication();
		} else {
			this.setState({
				isOpen: false
			});
		}
	}

	handleOpen(){
		if (!this.state.isOpen) {
			this.setState({isOpen: true});
		}
	}

	handleClose(){
		this.setState({isOpen: false});
	}

	onStopDrag(draggableStyle){
		this.draggableStyle = draggableStyle;
	}

	render(){
		const {isReadyForProcessing, isApplicationOk} = this.props;
		const btnCls = isReadyForProcessing ? "btn btn-primary" : "btn btn-primary disabled";
		const btnStyle = {position:'absolute', zIndex:999, top:5, right:20};

		return (
			<Fragment>
				<button id="masterEl" style={btnStyle} className={btnCls} onClick={this.handleOpen.bind(this)}>Skicka ansökan</button>

				<DraggableContent
					isApplicationOk={isApplicationOk}
					state={this.state}
					processingFns={this.processingFns}
					closeFn={this.handleClose.bind(this)}
					initialPos={initialPos(this.draggableStyle, 'masterEl')}
					onStopDrag={this.onStopDrag.bind(this)}
				/>
			</Fragment>
		);
	}
}

const DraggableContent = ({isApplicationOk, state, closeFn, initialPos, onStopDrag, processingFns}) => {
	return state.isOpen &&
		<Draggable dragElementId="drag-element" initialPos={initialPos} onStopDrag={onStopDrag}>
			<Panel
				isApplicationOk={isApplicationOk}
				state={state}
				processingFns={processingFns}
				closeFn={closeFn}
			/>
		</Draggable>;
};

const initialPos = (draggableStyle, masterElId) => {
	return slaveEl => {
		if (draggableStyle) return draggableStyle;

		const masterEl = document.getElementById(masterElId);

		if (masterEl) {
			let {right, bottom} = masterEl.getBoundingClientRect();
			const slaveRootRect = slaveEl.getBoundingClientRect();

			return {
				top: bottom - slaveRootRect.height - 2,
				left: right - slaveRootRect.width - 2,
				height: 300
			};
		}
	}
};

const Panel = ({isApplicationOk, state, processingFns, closeFn}) => {
	const defaultStyle = {margin:0, position:'relative', height:'100%'};
	const style = state.isOpen
		? defaultStyle
		: Object.assign({}, defaultStyle, {visibility:'hidden'});

	const panelCls = isApplicationOk
		? "panel-body bg-success"
		: "panel-body bg-danger";

	return (
		<div className="panel panel-default" style={style}>
			<div id="drag-element" className="panel-heading">
				<span>Skicka ansökan</span>
				<CloseBtn closeFn={closeFn} />
			</div>

			<div className={panelCls} style={{padding:'5px 7px', height:'calc(100% - 41px)'}}>
				<ApplicationProcessPanels state={state} processingFns={processingFns} isApplicationOk={isApplicationOk} />
			</div>
		</div>
	);
};

const CloseBtn = ({closeFn}) => {
	const style = {float:'right', fontSize:22, cursor:'pointer'};
	const className = "glyphicon glyphicon-remove-sign text-danger";
	const onClick = () => {
		closeFn();
	};

	return <span style={style} className={className} onClick={onClick} title="Close" />;
};
