import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import axios from 'axios'
import store from '../../store'
const state = store.getState()

import NavNote from '../../components/navNote'
import NavNoteLoad from '../../components/navNoteLoad'
import NavTop from '../../components/navTop'
import Search from '../../components/search'

import { updateNotes, hideNav, showNav } from '../../actions'

let resp = {
	nav: {
		position: "fixed",
		height: "100vh",
		minWidth: "300px",
		maxWidth: "300px",
		backgroundColor: "#f9f9f9",
		borderRight: ".5px solid rgba(0,0,0,.08)",
		overflowY: "auto"
	},
	navPlace: {
		minWidth: "301px",
		maxWidth: "301px"
	},
	overlay: {

	}
}

if (window.innerWidth <= 700) {
	resp = {
		nav: {
			position: "fixed",
			top: 0,
			bottom: 0,
			height: "100vh",
			minWidth: "300px",
			maxWidth: "300px",
			backgroundColor: "#f9f9f9",
			borderRight: "1px solid rgba(0,0,0,.08)",
			overflowY: "auto",
			zIndex: 102
		},
		navPlace: {
			minWidth: "0",
			maxWidth: "0"
		},
		overlay: {
			position: "fixed",
			zIndex: 101,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0,0,0,.55)"
		}
	}
}

const style = {
	nav: {
		position: "fixed",
		height: "100vh",
		minWidth: "300px",
		maxWidth: "300px",
		backgroundColor: "#f9f9f9",
		borderRight: "1px solid rgba(0,0,0,.08)",
		overflowY: "auto"
	},
	navPlace: {
		minWidth: "301px",
		maxWidth: "301px"
	},
	hide: {
		display: "none"
	},
	top: {
		borderBottom: ".5px solid rgba(0,0,0,.08)",
		backgroundColor: "#f9f9f9"
	},
	moreNotes: {
		padding: "30px 10px",
		textAlign: "center",
		color: "#999"
	},
	moreNotesHov: {
		padding: "30px 10px",
		textAlign: "center",
		color: "#777",
		backgroundColor: "#fff",
		cursor: "pointer"
	},
	refreshNotes: {
		borderBottom: "1px solid rgba(0,0,0,.08)",
		padding: "20px 10px",
		textAlign: "center",
		color: "#999"
	},
	refreshNotesHov: {
		borderBottom: "1px solid rgba(0,0,0,.08)",
		padding: "20px 10px",
		textAlign: "center",
		color: "#777",
		backgroundColor: "#fff",
		cursor: "pointer"
	}
}

class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.state = {moreAvailable: false, fetching: false}
		store.subscribe(() => {
			this.setState({a: false})
		})
	}
	componentDidMount() {
		this.getNotes(10)
	}
	getNotes(lim) {
		lim = lim != 10 ? 999 : lim
		lim === 999 ? this.setState({fetching: true}) : ""
		let user = null
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = this.props.user.userId
    	} else if (cookie.load('user')) {
    	  user = cookie.load('user').userId
    	} 
		axios.get("/api/getnotes", {
			params: {
				uid: user,
				lim: lim
			}
		})
		.then((res) => {
			store.dispatch(updateNotes(res.data))
			let expires = new Date()
			expires.setMinutes(expires.getMinutes() + 10)
			if (Object.keys(res.data).length === 10 && lim === 10) {
				this.setState({moreAvailable: true, fetching: false, expires: expires})
			}
			if (lim === 999) {
    			store.dispatch(updateNotes(res.data))
    			this.setState({moreAvailable: false, fetching: false, expires: expires})				
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}
	toggleNav() {
		if (store.getState().nav) {
			store.dispatch(hideNav())
		} else {
			store.dispatch(showNav())
		}
	}
	render() {
		let moreNotes = <div></div>
		let notes = <NavNoteLoad />
		let overlay = null
		let refresh = this.state.expires <= new Date() ? <div onClick={this.getNotes.bind(this)} onMouseEnter={() => {this.setState({refreshHov: true})}} onMouseLeave={() => {this.setState({refreshHov: false})}} style={this.state.refreshHov ? style.refreshNotesHov : style.refreshNotes}>Click to refresh notes</div> : null
		if (Object.keys(this.props.notes).length >= 1 && this.props.notes !== "Not logged in") {
			notes = <span>{this.props.notes.sort((a,b) => {return new Date(b.updated) - new Date(a.updated)}).filter((note) => {
				let combined = note.title.concat(note.content).toLowerCase()
				return combined.indexOf(this.props.search) !== -1
			}).map(note => {
				return <NavNote id={note._id} key={note._id} title={note.title} date={note.updated} body={note.preview} />
			})}</span>
		}
		if (this.state.moreAvailable) {
			moreNotes = <div onClick={this.getNotes.bind(this)} onMouseEnter={() => {this.setState({moreHov: true})}} onMouseLeave={() => {this.setState({moreHov: false})}} style={this.state.moreHov ? style.moreNotesHov : style.moreNotes}>Click for more notes</div>
		}
		if (this.state.moreAvailable && this.state.fetching) {
			moreNotes = <div style={style.moreNotes}>Loading...</div>
		}
		if (window.innerWidth <= 700) {
			overlay = <div onClick={this.toggleNav.bind(this)} style={this.props.nav ? resp.overlay : style.hide}></div>
		}
		return (
			<div>
			<div style={this.props.nav ? resp.navPlace : style.hide}></div>
			<div style={this.props.nav ? resp.nav : style.hide}>
				<div style={style.top}>
					<Search />
				</div>
				{refresh}
				{notes}
				{moreNotes}
			</div>
			{overlay}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    notes: state.notes,
    user: state.user,
    search: state.search
  }
}

module.exports = connect(mapStateToProps)(Nav)