import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import axios from 'axios'
import store from '../../store'
const state = store.getState()

import Note from '../../components/archiveNote'

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

class Archive extends React.Component {
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
		let data = {
			params: {
				uid: user
			}
		}
		axios.get('/api/getarchive', data)
		.then((res) => {
			this.setState({
				notes: res.data,
				fetched: true
			})
		})
		.catch((err) => {
			console.log(err)
		})
	}
	hoverIn(e) {
		this.setState({hov: true})
	}
	hoverOut(e) {
		this.setState({hov: false})
	}
	render() {
		let notes = null
		if (!this.state.fetched) {
			notes = <Note title="Loading..." body="Loading..." date={new Date()} />
		}
		if (this.state.fetched) {
			notes = <span>{this.state.notes.map(note => {
				return <Note title={note.title} date={note.updated} body={note.preview} id={note._id} key={note._id} />
			})}</span>
		}
		return (
			<div style={style.cont}>
				<div style={style.inner}>
					<div style={style.head}>Archived Notes</div>
					{notes}
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

module.exports = connect(mapStateToProps)(Archive)