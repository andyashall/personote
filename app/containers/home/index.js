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
	para: {
		padding: "40px 20px",
		color: "#999"
	},
	icon: {
		verticalAlign: "middle"
	}
}

class Home extends React.Component {
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
	render() {
		return (
			<div style={style.cont}>
				<p style={style.para}><i style={style.icon} className="material-icons">arrow_back</i> Click on a note to get started</p>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

module.exports = connect(mapStateToProps)(Home)