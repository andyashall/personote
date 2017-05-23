import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import axios from 'axios'
import store from '../../store'
const state = store.getState()

import {advancedOn, advancedOff} from '../../actions'

const style = {
	cont: {
		marginTop: "50px",
		minHeight: "calc(100vh - 50px)",
		backgroundColor: "#fff",
		width: "100%"
	},
	inner: {
		width: "700px",
		position: "relative",
		left: "50%",
		transform: "translateX(-50%)",
		padding: "2rem 0",
		boxSizing: "border-box"
	},
	head: {
		fontSize: "1.2rem",
		color: "#999",
		fontWeight: "bold",
		padding: "15px 10px"
	},
	title: {
		fontSize: "1rem",
		color: "#999",
		fontWeight: "bold",
		padding: "15px 10px"		
	},
	form: {
		padding: "0 10px"
	},
	label: {
		fontWeight: "bold",
		display: "block",
		marginBottom: "5px",
		marginTop: "10px",
		color: "#999",
		fontSize: ".8rem"
	},
	input: {
		border: "1px solid #f1f1f1",
		borderRadius: "3px",
		padding: "5px 8px",
		outline: "none",
		backgroundColor: "#f1f1f1",
		width: "300px"
	},
	inputFocus: {
		border: "1px solid #ccc",
		borderRadius: "3px",
		padding: "5px 8px",
		outline: "none",
		backgroundColor: "#fff",
		width: "300px"
	},
	butt: {
		display: "block",
		marginTop: "20px",
		backgroundColor: "#f1f1f1",
		border: "none",
		color: "#777",
		padding: "10px 15px",
		borderRadius: "3px"
	},
	buttHov: {
		display: "block",
		marginTop: "20px",
		backgroundColor: "#e6e6e6",
		border: "none",
		color: "#3c3c3c",
		padding: "10px 15px",
		borderRadius: "3px",
		cursor: "pointer"
	},
	ebutt: {
		display: "block",
		marginLeft: "10px",
		backgroundColor: "#f1f1f1",
		border: "none",
		color: "#777",
		padding: "10px 15px",
		borderRadius: "3px"
	},
	ebuttHov: {
		display: "block",
		backgroundColor: "#e6e6e6",
		border: "none",
		color: "#3c3c3c",
		padding: "10px 15px",
		borderRadius: "3px",
		cursor: "pointer",
		marginLeft: "10px"
	}
}

class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {oldFocus: false, newFocus: false, confFocus: false, buttHov: false}
	}
	componentDidMount() {

	}
	submit(e) {
		e.preventDefault()
		let user = ""
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = this.props.user.userId
    	} else if (cookie.load('user')) {
    	  user = cookie.load('user').userId
    	} 
	    if (this.state.newPass.toString().length <= 7) {
	     	console.log("Password too short boi")
	     	return
	    }
		let data = {
			uid: user,
			pass: this.state.password,
			newPass: this.state.newPass,
			conf: this.state.conf
		}
		axios.post('/api/changepassword', data)
		.then((res) => {
			console.log(res)
		})
		.catch((err) => {
			console.log(err)
		})
	}
	toggleEditor() {
		if (this.props.editor) {
			store.dispatch(advancedOff())
		} else {
			store.dispatch(advancedOn())
		}
	}
	render() {
		let editorText = "Turn on"
		if (this.props.editor) {
			editorText = "Turn off"
		}
		return (
			<div style={style.cont}>
				<div style={style.inner}>
					<div style={style.head}>Settings</div>
					<div style={style.title}>Advanced editor</div>
					<button onClick={this.toggleEditor.bind(this)} onMouseEnter={() => {this.setState({ebuttHov: true})}} onMouseLeave={() => {this.setState({ebuttHov: false})}} style={this.state.ebuttHov ? style.ebuttHov : style.ebutt}>{editorText}</button>
					<div style={style.title}>Change password</div>
					<form onSubmit={this.submit.bind(this)} style={style.form}>
						<label style={style.label}>Old password</label>
						<input onChange={(e) => {this.setState({password: e.target.value})}} onFocus={() => {this.setState({oldFocus: true})}} onBlur={() => {this.setState({oldFocus: false})}} style={this.state.oldFocus ? style.inputFocus : style.input} type="password" />
						<label style={style.label}>New password</label>
						<input onChange={(e) => {this.setState({newPass: e.target.value})}} onFocus={() => {this.setState({newFocus: true})}} onBlur={() => {this.setState({newFocus: false})}} style={this.state.newFocus ? style.inputFocus : style.input} type="password" />
						<label style={style.label}>Comfirm new password</label>
						<input onChange={(e) => {this.setState({conf: e.target.value})}} onFocus={() => {this.setState({confFocus: true})}} onBlur={() => {this.setState({confFocus: false})}} style={this.state.confFocus ? style.inputFocus : style.input} type="password" />
						<button onMouseEnter={() => {this.setState({buttHov: true})}} onMouseLeave={() => {this.setState({buttHov: false})}} style={this.state.buttHov ? style.buttHov : style.butt}>Submit</button>
					</form>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		editor: state.editor
	}
}

module.exports = connect(mapStateToProps)(Settings)