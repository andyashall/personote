import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import ta from 'time-ago'
import store from '../../store'
const state = store.getState()

import { saveNote } from '../../actions'

const style = {
	cont: {
		width: "100%",
		boxSizing: "border-box",
		cursor: "pointer",
		backgroundColor: "#f9f9f9",
		borderBottom: ".5px solid rgba(0,0,0,.08)",
		padding: "15px 10px"
	},
	hov: {
		width: "100%",
		boxSizing: "border-box",
		cursor: "pointer",
		backgroundColor: "#fff",
		borderBottom: ".5px solid rgba(0,0,0,.08)",
		padding: "15px 10px"
	},
	title: {
		color: "#3c3c3c",
		marginBottom: "5px"
	},
	date: {
		color: "#999",
		marginBottom: "5px",
		fontSize: ".8rem"	
	},
	body: {
		color: "#777",
		fontSize: ".8rem",
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: "3",
		overflow: "hidden",
		textOverflow: "ellipsis"
	},
	link: {
		textDecoration: "none"
	}
}

class NavNote extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false}
	}
	hoverIn(e) {
		this.setState({hov: true})
	}
	hoverOut(e) {
		this.setState({hov: false})
	}
	getTime(time) {
	  return ta().ago(time)
	}
	matches(e) {
		return e._id == this.props.id
	}
	keyDown(e) {
		if (e.key === "Enter") {this.getNote.bind(this)}
	}
	getNote() {
		let note = this.props.notes.find(this.matches.bind(this))
		store.dispatch(saveNote(note))
	}
	render() {
		return (
			<Link onKeyDown={this.keyDown.bind(this)} style={style.link} to={"/n/" + this.props.id}>
			<div onClick={this.getNote.bind(this)} onMouseEnter={this.hoverIn.bind(this)} onMouseLeave={this.hoverOut.bind(this)} style={this.state.hov ? style.hov : style.cont}>
				<div style={style.title}>{this.props.title}</div>
				<div style={style.date}>{this.getTime(this.props.date)}</div>
				<div style={style.body}>{this.props.body}</div>
			</div>
			</Link>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    note: state.note
  }
}

module.exports = connect(mapStateToProps)(NavNote)