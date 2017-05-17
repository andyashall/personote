import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import axios from 'axios'
import store from '../../store'
const state = store.getState()

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
	}
}

class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false, notes: {}, fetched: false}
	}
	componentDidMount() {
		let user = ""
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = this.props.user.userId
    	} else if (cookie.load('user')) {
    	  user = cookie.load('user').userId
    	} 
	}
	hoverIn(e) {
		this.setState({hov: true})
	}
	hoverOut(e) {
		this.setState({hov: false})
	}
	render() {
		return (
			<div style={style.cont}>
				<div style={style.inner}>
					<div style={style.head}>Settings</div>
					<input />
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

module.exports = connect(mapStateToProps)(Settings)