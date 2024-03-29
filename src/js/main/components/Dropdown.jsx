import React, { Component } from 'react';


export default class Dropdown extends Component{
	constructor(props){
		super(props);

		this.state = {
			dropdownOpen: false,
			selectedItemKey: undefined
		};

		this.outsideClickHandler = this.handleOutsideClick.bind(this);
		document.addEventListener('click', this.outsideClickHandler, false);
	}

	handleOutsideClick(e){
		if (this.node && !this.node.contains(e.target) && this.state.dropdownOpen) {
			this.setState({dropdownOpen: false});
		}
	}

	onDropdownClick(){
		this.setState({dropdownOpen: !this.state.dropdownOpen});
	}

	onDropDownItemClick(selectedItemKey){
		if (selectedItemKey!== this.state.selectedItemKey) {
			this.props.itemClickAction(selectedItemKey);
		}

		this.setState({dropdownOpen: !this.state.dropdownOpen, selectedItemKey});
	}

	componentWillUnmount(){
		document.removeEventListener('click', this.outsideClickHandler, false);
	}

	render(){
		const {dropdownOpen} = this.state;
		const {isEnabled, isSorter, selectedItemKey, isAscending, lookup, defaultLbl} = this.props;
		const nodeClass = dropdownOpen ? 'dropdown open' : 'dropdown';

		return (
			<span ref={div => this.node = div} className={nodeClass} style={{display: 'inline-block', marginLeft: 8, verticalAlign: 8}}>
				{
					isSorter
						? <SortButton
							isEnabled={isEnabled}
							selectedItemKey={selectedItemKey}
							isAscending={isAscending}
							clickAction={this.onDropdownClick.bind(this)}
							lookup={lookup}
							defaultLbl={defaultLbl}
						/>
						: <Button
							isEnabled={isEnabled}
							selectedItemKey={selectedItemKey}
							clickAction={this.onDropdownClick.bind(this)}
							lookup={lookup}
							defaultLbl={defaultLbl}
						/>
				}

				<ul className="dropdown-menu">{
					Object.keys(lookup).map((key, idx) =>
						<li key={'ddl' + idx}>
							<a onClick={this.onDropDownItemClick.bind(this, key)} style={{cursor:'pointer'}}>{lookup[key]}</a>
						</li>
					)
				}</ul>
			</span>
		);
	}
}

const SortButton = ({isEnabled, selectedItemKey, isAscending, clickAction, lookup, defaultLbl = 'Sort by'}) => {
	if (isEnabled) {
		const glyphCls = selectedItemKey
			? isAscending
				? 'glyphicon glyphicon-sort-by-attributes'
				: 'glyphicon glyphicon-sort-by-attributes-alt'
			: '';

		const lbl = selectedItemKey
			? lookup[selectedItemKey]
			: defaultLbl;

		return (
			<button className="btn btn-default dropdown-toggle" type="button" onClick={clickAction}>
				<span><span className={glyphCls}/> {lbl}</span> <span className="caret"/>
			</button>
		);
	} else {
		return (
			<button className="btn btn-default dropdown-toggle disabled" type="button"style={{pointerEvents:'auto'}}>
				<span>{defaultLbl}</span> <span className="caret"/>
			</button>
		);
	}
};

const Button = ({isEnabled, selectedItemKey, clickAction, lookup, defaultLbl = 'Select option'}) => {
	if (isEnabled) {
		const lbl = selectedItemKey
			? lookup[selectedItemKey]
			: defaultLbl;
		const btnCls = isEnabled
			? 'btn btn-default dropdown-toggle'
			: 'btn btn-default dropdown-toggle disabled';

		return (
			<button className={btnCls} type="button" onClick={clickAction}>
				<span>{lbl}</span> <span className="caret" />
			</button>
		);
	} else {
		return (
			<button className="btn btn-default dropdown-toggle disabled" type="button">
				<span>{defaultLbl}</span> <span className="caret"/>
			</button>
		);
	}

};
