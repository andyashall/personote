import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import axios from 'axios'
import store from '../../store'
const state = store.getState()

const style = {
	cont: {
		marginTop: "50px",
		minHeight: "calc(100vh - 100px)",
		backgroundColor: "#fff",
		width: "100%"
	},
	para: {
		padding: "40px 25px",
		color: "#999",
		zIndex: "2"
	},
	icon: {
		verticalAlign: "middle",
		fontSize: "1rem"
	},
	text: {
		verticalAlign: "middle",
		fontSize: ".8rem"
	}
}

class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false, notes: {}, fetched: false}
	}
	componentDidMount() {

	}
	render() {
		return (
			<div style={style.cont}>
				<p style={style.para}><i style={style.icon} className="material-icons">arrow_back</i> <span style={style.text}>Click on a note to get started</span></p>
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