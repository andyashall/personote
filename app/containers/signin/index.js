import React from 'react'
import {Link, browserHistory} from 'react-router'
import axios from 'axios'
import cookie from 'react-cookie'

import {signIn} from '../../actions'
import store from '../../store'
const state = store.getState()

const style = {
	cont: {
		width: "100%",
		boxSizing: "border-box",
		marginTop: "50px",
		position: "relative",
		height: "calc(100vh - 50px)"
	},
	cent: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%,-50%)",
		backgroundColor: "#fff",
		padding: "1rem 2rem",
		borderRadius: "3px",
		// border: "1px solid rgba(0,0,0,.08)",
		width: "300px"
	},
	input: {
		border: "none",
		borderBottom: "1px solid #dedede",
		width: "100%",
		boxSizing: "border-box",
		borderRadius: "3px",
		padding: "5px 8px",
		marginBottom: "10px"
	},
	button: {
		border: "none",
		width: "100%",
		boxSizing: "border-box",
		borderRadius: "3px",
		padding: "5px 8px",
		backgroundColor: "#f1f1f1",
		color: "#3c3c3c",
		cursor: "pointer"
	},
	change: {
		textAlign: "center",
		marginTop: "1rem",
		cursor: "pointer",
		color: "#999",
		fontSize: ".8rem"
	}
}

class Signin extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false, signIn: true, signUp: false, }
	}
	hoverIn(e) {
		this.setState({hov: true})
	}
	hoverOut(e) {
		this.setState({hov: false})
	}
	signIn() {
	    let email = document.getElementById("email"),
	        pass = document.getElementById("password")
	    if (!this.state.email) {
	      email.style.borderColor = "red"
	    }
	    if (pass.value.toString().length <= 7) {
	      pass.style.borderColor = "red"
	    }
	    if (this.state.email && pass.value.toString().length > 7) {
		    let data = {
		      email: email.value.toString(),
		      pass: pass.value.toString()
		    }
			axios.post("/api/signin", data)
			.then((res) => {
				store.dispatch(signIn(res.data))
				cookie.save('user', res.data)
				browserHistory.push("/")
			})
			.catch((err) => {
				
			})
		}
	}
	signUp() {
	    let email = document.getElementById("email"),
	        pass = document.getElementById("password")
	    if (!this.state.email) {
	      email.style.borderColor = "red"
	    }
	    if (pass.value.toString().length <= 7) {
	      pass.style.borderColor = "red"
	    }
	    if (this.state.email && pass.value.toString().length > 7) {
		    let data = {
		      email: email.value.toString(),
		      pass: pass.value.toString()
		    }
			axios.post("/api/signup", data)
			.then((res) => {
				store.dispatch(signIn(res.data))
				cookie.save('user', res.data)
				browserHistory.push("/")
			})
			.catch((err) => {
				
			})
		}
	}
	email(event) {
		let val = event.target.value
		let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
		if (!re.test(val)) {
			event.target.style.borderColor = "red"
			this.setState({email: false})
		} else {
			event.target.style.borderColor = "rgba(0,0,0,.13)"
			this.setState({email: true})
		}
	}
	changeSU() {
		this.setState({
			signIn: false,
			signUp: true
		})
	}
	changeSI() {
		this.setState({
			signIn: true,
			signUp: false
		})
	}
	render() {
		let control = null
		let headerText = null
		let button = null
		if (this.state.signIn) {
			control = <div onClick={this.changeSU.bind(this)} style={style.change}>or Sign up</div>
			headerText = "Sign in"
			button = <button onClick={this.signIn.bind(this)} style={style.button}>Sign in</button>
		}
		if (this.state.signUp) {
			control = <div onClick={this.changeSI.bind(this)} style={style.change}>or Sign in</div>
			headerText = "Sign up"
			button = <button onClick={this.signUp.bind(this)} style={style.button}>Sign up</button>
		}
		return (
			<div style={style.cont}>
				<div style={style.cent}>
					<h1 style={{textAlign: "center", color: "#999"}}>{headerText}</h1>
					<input style={style.input} onChange={this.email.bind(this)} placeholder="Email" type="email" id="email" />
					<input style={style.input} placeholder="Password" type="password" id="password" />
					{button}
					{control}
				</div>
			</div>
		)
	}
}

module.exports = Signin