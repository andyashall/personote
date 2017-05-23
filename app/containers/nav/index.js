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
		this.state = {doot: "doot"}
		store.subscribe(() => {
			this.setState({notes: this.props.notes, moreAvailable: false})
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
			store.dispatch(getNotes(res.data))
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
		let notes = <NavNote id="1" key="1" title="Loading notes..." date={new Date()} body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
		if (Object.keys(this.props.notes).length >= 1 && this.props.notes !== "Not logged in") {
			notes = <span>{this.props.notes.sort((a,b) => {return new Date(b.updated) - new Date(a.updated)}).filter((note) => {
				let combined = note.title.concat(note.content).toLowerCase()
				return combined.indexOf(this.props.search) !== -1
			}).map(note => {
				return <NavNote id={note._id} key={note._id} title={note.title} date={note.updated} body={note.preview} />
			})}</span>
		}
		return (
			<div>
			<div style={this.props.nav ? style.navPlace : style.hide}></div>
			<div style={this.props.nav ? style.nav : style.hide}>
				<div style={style.top}>
					<Search />
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