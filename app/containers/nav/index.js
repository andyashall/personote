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

import { updateNotes, moreNotes, updatePost } from '../../actions'

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
		borderBottom: "1px solid rgba(0,0,0,.08)",
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
	}
}

class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.state = {doot: "doot"}
		store.subscribe(() => {
			this.setState({moreAvailable: false})
		})
	}
	componentDidMount() {
		this.getNotes()
	}
	getNotes() {
		let user = null
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = this.props.user.userId
    	} else if (cookie.load('user')) {
    	  user = cookie.load('user').userId
    	} 
		axios.get("/api/getnotes", {
			params: {
				uid: user
			}
		})
		.then((res) => {
			store.dispatch(updateNotes(res.data))
			if (Object.keys(res.data).length === 10) {
				this.setState({moreAvailable: true})
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
		if (Object.keys(this.props.notes).length >= 1 && this.props.notes !== "Not logged in") {
			notes = <span>{this.props.notes.sort((a,b) => {return new Date(b.updated) - new Date(a.updated)}).filter((note) => {
				let combined = note.title.concat(note.content).toLowerCase()
				return combined.indexOf(this.props.search) !== -1
			}).map(note => {
				return <NavNote id={note._id} key={note._id} title={note.title} date={note.updated} body={note.preview} />
			})}</span>
		}
		if (Object.keys(this.props.notes).length >= 10) {
			moreNotes = <div onMouseEnter={() => {this.setState({moreHov: true})}} onMouseLeave={() => {this.setState({moreHov: false})}} style={this.state.moreHov ? style.moreNotesHov : style.moreNotes}>Click for more notes</div>
		}
		return (
			<div>
			<div style={this.props.nav ? style.navPlace : style.hide}></div>
			<div style={this.props.nav ? style.nav : style.hide}>
				<div style={style.top}>
					<Search />
				</div>
				{notes}
				{moreNotes}
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