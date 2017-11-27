import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {browserHistory} from 'react-router'
import cookie from 'react-cookie'
import axios from 'axios'
import {showNav, hideNav, signIn, signOut} from '../../actions'
import store from '../../store'
const state = store.getState()
import HeadButton from '../headButton'

const style = {
	head : {
		width: "100%",
		top: 0,
		position: "absolute",
		height: "50px",
		backgroundColor: "#fff",
		color: "#777",
		zIndex: 100
	},
	left: {
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
		left: "20px"
	},
	right: {
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
		right: "20px"
	},
	icon: {
		verticalAlign: "middle",
		cursor: "pointer",
		marginRight: "10px",
		color: "#999"
	},
	iconHov: {
		verticalAlign: "middle",
		cursor: "pointer",
		marginRight: "10px",
		color: "#3c3c3c"
	},
	account: {
		display: "inline-block",
		marginLeft: "25px",
		textTransform: 'uppercase',
		width: "30px",
		height: "30px",
		textAlign: "center",
		backgroundColor: "#999",
		color: "#fff",
		verticalAlign: "middle",
		lineHeight: "30px",
		boxSizing: 'border-box',
		borderRadius: "50%",
		cursor: "pointer"
	},
	signIn: {
		marginLeft: "20px",
		border: "none",
		borderRadius: "3px",
		padding: "8px 15px",
		cursor: "pointer",
		fontSize: ".8rem",
		backgroundColor: "transparent",
		color: "#999"
	},
	signInHov: {
		marginLeft: "20px",
		border: "none",
		borderRadius: "3px",
		padding: "8px 15px",
		cursor: "pointer",
		fontSize: ".8rem",
		backgroundColor: "#f1f1f1",
		color: "#3c3c3c"
	},
	options: {
		marginLeft: "20px",
		border: "none",
		borderRadius: "3px",
		padding: "8px 15px",
		cursor: "pointer",
		fontSize: ".8rem",
		backgroundColor: "transparent",
		color: "#999",
		display: "inline-block"
	},
	optionsHide: {
		display: "none"
	}
}

class Head extends React.Component {
	constructor(props) {
		super(props)
		this.state = {foo: "bar"}
	}
	toggleNav() {
		if (this.props.nav) {
			store.dispatch(hideNav())
		} else {
			store.dispatch(showNav())
		}
	}
	getFirstChar(e) {
		return e.charAt(0)
	}
	signOut() {
		cookie.remove('user')
		let rootUrl = location.protocol + '//' + location.host
		window.location.assign(rootUrl)
	}
	render() {
		let account = undefined,
			buttons = undefined
		if (Object.keys(this.props.user).length >= 1) {
			account =	<span>
							<HeadButton link="/new" text="New note +" />
							<div onClick={() => {let val = false; if (this.state.showOptions) {val = false} else {val = true} this.setState({showOptions: val})}} style={style.account}>{this.getFirstChar(this.props.user.email)}</div>
							<div onClick={this.signOut.bind(this)} style={this.state.showOptions ? style.options : style.optionsHide}>Sign out</div>
						</span>
		} 
		if (Object.keys(this.props.user).length < 1) {
			account = <Link to="/signin"><button onMouseEnter={() => {this.setState({signInHov: true})}} onMouseLeave={() => {this.setState({signInHov: false})}} style={this.state.signInHov ? style.signInHov : style.signIn}>Sign up / Sign in</button></Link>
		}
		if (!this.props.user) {
			account = <Link to="/signin"><button onMouseEnter={() => {this.setState({signInHov: true})}} onMouseLeave={() => {this.setState({signInHov: false})}} style={this.state.signInHov ? style.signInHov : style.signIn}>Sign up / Sign in</button></Link>
		}
		if (window.innerWidth <= 700) {
			// Change this to best practice or use css?
		} else {
			buttons = <span> 
					<HeadButton link="/" text="Home" />
					<HeadButton link="/archive" text="Archive" />
					<HeadButton link="/settings" text="Settings" />
					</span>
		}
		return (
			<div style={style.head}>
				<div style={style.left}>
					<i onMouseEnter={() => {this.setState({iconHov: true})}} onMouseLeave={() => {this.setState({iconHov: false})}} onClick={this.toggleNav.bind(this)} style={this.state.iconHov ? style.iconHov : style.icon} className="material-icons">menu</i>
					{buttons}
				</div>
				<div style={style.right}>
					{account}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    user: state.user
  }
}

module.exports = connect(mapStateToProps)(Head)