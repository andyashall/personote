import React from 'react'
import {Link, browserHistory} from 'react-router-dom'
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
		width: "300px"
	},
	title: {
		textAlign: "center",
		color: "#999",
		marginBottom: "2rem"
	},
	input: {
		border: "1px solid #f1f1f1",
		borderRadius: "3px",
		padding: "10px 8px",
		outline: "none",
		backgroundColor: "#f1f1f1",
		boxSizing: "border-box",
		marginBottom: "10px",
		width: "300px"
	},
	inputFocus: {
		border: "1px solid #ccc",
		borderRadius: "3px",
		padding: "10px 8px",
		outline: "none",
		backgroundColor: "#fff",
		boxSizing: "border-box",
		marginBottom: "10px",
		width: "300px"
	},
	button: {
		border: "none",
		width: "100%",
		boxSizing: "border-box",
		borderRadius: "3px",
		padding: "10px 8px",
		backgroundColor: "#3c3c3c",
		color: "#fff",
		cursor: "pointer"
	},
	buttonHov: {
		border: "none",
		width: "100%",
		boxSizing: "border-box",
		borderRadius: "3px",
		padding: "10px 8px",
		backgroundColor: "#5c5c5c",
		color: "#fff",
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

export default class Signin extends React.Component {
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
				let rootUrl = location.protocol + '//' + location.host
				window.location.assign(rootUrl)
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
				if (res.data === "Incorrect password") {
					console.log("Incorrect password")
					return
				}
				store.dispatch(signIn(res.data))
				cookie.save('user', res.data)
				let rootUrl = location.protocol + '//' + location.host
				window.location.assign(rootUrl)
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
			button = <button onMouseEnter={() => {this.setState({buttHov: true})}} onMouseLeave={() => {this.setState({buttHov: false})}} style={this.state.buttHov ? style.buttonHov : style.button} onClick={this.signIn.bind(this)}>Sign in</button>
		}
		if (this.state.signUp) {
			control = <div onClick={this.changeSI.bind(this)} style={style.change}>or Sign in</div>
			headerText = "Sign up"
			button = <button onMouseEnter={() => {this.setState({buttHov: true})}} onMouseLeave={() => {this.setState({buttHov: false})}} style={this.state.buttHov ? style.buttonHov : style.button} onClick={this.signUp.bind(this)}>Sign up</button>
		}
		return (
			<div style={style.cont}>
				<div style={style.cent}>
					<input style={style.input} onChange={this.email.bind(this)} onFocus={() => {this.setState({emailFocus: true})}} onBlur={() => {this.setState({emailFocus: false})}} style={this.state.emailFocus ? style.inputFocus : style.input} placeholder="Email" type="email" id="email" />
					<input style={style.input} onFocus={() => {this.setState({passFocus: true})}} onBlur={() => {this.setState({passFocus: false})}} style={this.state.passFocus ? style.inputFocus : style.input} placeholder="Password" type="password" id="password" />
					{button}
					{control}
				</div>
			</div>
		)
	}
}