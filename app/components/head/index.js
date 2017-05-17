import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import cookie from 'react-cookie'
import axios from 'axios'
import {showNav, hideNav, signIn} from '../../actions'
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
		// borderBottom: "1px solid rgba(0,0,0,.08)",
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
	center: {
		position: "absolute",
		top: "50%",
		transform: "translate(-50%, -50%)",
		left: "50%",
		color: "#999"
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
		marginLeft: "20px",
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
	newNote: {
		backgroundColor: "transparent",
		color: "#999",
		border: "none",
		borderRadius: "3px",
		padding: "8px 15px",
		cursor: "pointer"
	},
	newNoteHov: {
		backgroundColor: "transparent",
		color: "#777",
		border: "none",
		borderRadius: "3px",
		padding: "8px 15px",
		cursor: "pointer",
		backgroundColor: "#f1f1f1"
	}
}

class Head extends React.Component {
	constructor(props) {
		super(props)
		this.state = {nav: props.nav, user: props.user}
		let userCookie = cookie.load('user')
		if (Object.keys(props.user).length === 0) {
			if (!userCookie) {
				this.state = {user: false}
			} else {
				this.state = {user: userCookie}
				store.dispatch(signIn(userCookie))
			}
		} else {
			this.state = {user: false}
		}
		store.subscribe(() => {
			this.setState({
				user: store.getState().user
			})
		})
	}
	toggleNav() {
		if (store.getState().nav) {
			store.dispatch(hideNav())
		} else {
			store.dispatch(showNav())
		}
	}
	getFirstChar(e) {
		return e.charAt(0)
	}
	render() {
		let account = undefined
		if (Object.keys(this.state.user).length >= 1) {
			account =	<span>
							<Link to="/new"><button onMouseEnter={() => {this.setState({newNoteHov: true})}} onMouseLeave={() => {this.setState({newNoteHov: false})}} style={this.state.newNoteHov ? style.newNoteHov : style.newNote}>New note +</button></Link>
							<div style={style.account}>{this.getFirstChar(this.state.user.email)}</div>
						</span>
		} 
		if (Object.keys(this.state.user).length < 1) {
			account = <Link to="/signin"><button onMouseEnter={() => {this.setState({signInHov: true})}} onMouseLeave={() => {this.setState({signInHov: false})}} style={this.state.signInHov ? style.signInHov : style.signIn}>Sign up / Sign in</button></Link>
		}
		if (!this.state.user) {
			account = <Link to="/signin"><button onMouseEnter={() => {this.setState({signInHov: true})}} onMouseLeave={() => {this.setState({signInHov: false})}} style={this.state.signInHov ? style.signInHov : style.signIn}>Sign up / Sign in</button></Link>
		}
		return (
			<div style={style.head}>
				<div style={style.left}>
					<i onMouseEnter={() => {this.setState({iconHov: true})}} onMouseLeave={() => {this.setState({iconHov: false})}} onClick={this.toggleNav.bind(this)} style={this.state.iconHov ? style.iconHov : style.icon} className="material-icons">menu</i>
					<HeadButton link="/" text="Home" />
					<HeadButton link="/archive" text="Archive" />
					<HeadButton link="/settings" text="Settings" />
				</div>
				<div style={style.center}>
				{/*	<i className="material-icons">landscape</i> */}
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