import React, { Component, Fragment } from 'react';


const btnStyle = {
	position:'absolute',
	bottom:10,
	left:10
};

export default class ApplicationProcessPanels extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return <Router {...this.props} />;
	}
}

const Router = props => {
	const {isLoggedIn, isApplicationReady} = props.state;
	const route = isLoggedIn
		? isApplicationReady
			? 'review'
			: 'submit'
		: 'login';

	switch(route){

		case 'login':
			return <Login {...props} />;

		case 'submit':
			return <Submit {...props} />;

		case 'review':
			return <Review {...props} />;

		default:
			return null;
	}
};

const Login = props => {
	return (
		<Fragment>
			<div>
				Här sker inloggning med Bank ID.
			</div>

			<div style={btnStyle}>
				<button className="btn btn-primary" onClick={props.processingFns.login}>Logga in</button>
			</div>
		</Fragment>
	);
};

const Submit = props => {
	return (
		<Fragment>
			<div>
				Är du säker på att du vill skicka in ansökan?
			</div>

			<YesNoBtns onClick={props.processingFns.submit} />
		</Fragment>
	);
};

const Review = props => {
	return (
		<Fragment>{
			props.isApplicationOk
				? <ReviewGreen {...props} />
				: <ReviewRed {...props} />
		}</Fragment>
	);
};

const ReviewGreen = props => {
	return (
		<Fragment>
			<p>
				Enligt de kriterier som utvärderats i denna tjänst överensstämmer din föreslagna byggnad och placering med gällande planbestämmelser.
				Dock betyder detta inte garanterat att bygglov beviljas eftersom andra kriterier också måste bedömas. Detta görs av kommunens bygglovshandläggare och xxx. Svar inom yyy dagar.
			</p>
			<p>
				Vill du skicka in ansökan?
			</p>

			<YesNoBtns onClick={props.processingFns.submit} submitApplication={true} />
		</Fragment>
	);
};

const ReviewRed = props => {
	return (
		<Fragment>
			<p>
				Enligt de kriterier som utvärderats i denna tjänst överensstämmer inte din föreslagna byggnad och placering med gällande planbestämmelser.
				Det finns dock inget hinder att göra en sådan ansökan. Men du bör sätta dig in i varför tjänsten inte godkänt din föreslagna byggnad och placering
				och fundera på om ditt förslag har en möjlighet att beviljas. Handläggning görs av kommunens bygglovshandläggare och xxx. Svar inom yyy dagar.
			</p>
			<p>
				Vill du skicka in ansökan?
			</p>

			<YesNoBtns onClick={props.processingFns.submit} submitApplication={true} />
		</Fragment>
	);
};

const YesNoBtns = ({onClick, submitApplication}) => {
	return (
		<div style={btnStyle}>
			<div style={{position:'relative'}}>
				<button className="btn btn-primary" onClick={_ => onClick(false)}>Nej</button>
				<button className="btn btn-primary" onClick={_ => onClick(true, submitApplication)} style={{marginLeft:470 }}>Ja</button>
			</div>
		</div>
	);
};
