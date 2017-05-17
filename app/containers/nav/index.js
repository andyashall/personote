import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import axios from 'axios'
import store from '../../store'
const state = store.getState()

import NavNote from '../../components/navNote'
import NavTop from '../../components/navTop'
import Search from '../../components/search'

import { getNotes, moreNotes, updatePost } from '../../actions'

const style = {
	nav: {
		// marginTop: "50px",
		// height: "calc(100vh - 50px)",
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
		borderBottom: "1px solid rgba(0,0,0,.08)",
		backgroundColor: "#f9f9f9"
	}
}

class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.state = {nav: props.nav, notes: props.notes}
		store.subscribe(() => {
			this.setState({
				notes: store.getState().notes,
				search: store.getState().search
			})
		})
	}
	componentDidMount() {
		this.getNotes()
	}
	getNotes() {
		let user = null
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = store.getState().user.userId
    	} else if (cookie.load('user')) {
    	  user = cookie.load('user').userId
    	} 
		axios.get("/api/getnotes", {
			params: {
				uid: user
			}
		})
		.then((res) => {
			store.dispatch(getNotes(res.data))
		})
		.catch((err) => {
			console.log(err)
		})
	}
	hoverIn(e) {
		let sidebar = document.getElementById("sidebar")
		sidebar.style.overflow = "auto"
	}
	hoverOut(e) {
		let sidebar = document.getElementById("sidebar")
		sidebar.style.overflow = "hidden"
	}
	toggleNav() {
		if (store.getState().nav) {
			store.dispatch(hideNav())
		} else {
			store.dispatch(showNav())
		}
	}
	render() {
		let notes = null
		if (!this.props.notes) {
			notes = <NavNote id="1" title="Feedback changes" date="1 hour ago" body="Hello this is a test with more text as i should probably set a max line clamp to around 3." />
		}
		if (this.props.notes.data === "Not logged in") {
			notes = <NavNote id="1" title="Feedback changes" date="1 hour ago" body="Hello this is a test with more text as i should probably set a max line clamp to around 3." />
		}
		if (Object.keys(this.props.notes).length === 0) {
			notes = <div></div>
		}
		if (Object.keys(this.props.notes).length >= 1 && this.props.notes.data !== "Not logged in") {
			notes = <span>{this.props.notes.data.sort((a,b) => {return new Date(b.updated) - new Date(a.updated)}).filter((note) => {
				let combined = note.title.concat(note.content).toLowerCase()
				return combined.indexOf(this.state.search) !== -1
			}).map(note => {
				return <NavNote id={note._id} key={note._id} title={note.title} date={note.updated} body={note.preview} />
			})}</span>
		}
		return (
			<div>
			<div style={this.props.nav ? style.navPlace : style.hide}></div>
			<div id="sidebar" onMouseEnter={this.hoverIn.bind(this)} onMouseLeave={this.hoverOut.bind(this)} style={this.props.nav ? style.nav : style.hide}>
				<div style={style.top}>
					<Search />
				{/*	<NavTop icon="home" link="/" text="Home" />
					<NavTop icon="settings" link="/settings" text="Settings" /> */}
				</div>
				{notes}
			</div>
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