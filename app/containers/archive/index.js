import React from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import axios from 'axios'
import store from '../../store'
const state = store.getState()
import {searchArchivedNotes} from '../../actions'

import Note from '../../components/archiveNote'
import NoteLoad from '../../components/archiveNoteLoad'

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
	search: {
		border: "none",
		color: "#3c3c3c",
		padding: "15px 10px",
		outline: "none",
		boxSizing: "border-box",
		width: "100%",
		position: "sticky",
		top: 0
	}
}

class Archive extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false, notes: {}, fetched: false}
	}
	componentWillMount() {
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
			if (this.refs.mounted) {
				this.setState({
					notes: res.data,
					fetched: true
				})
			}
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
	search(e) {
		store.dispatch(searchArchivedNotes(e.target.value.toLowerCase()))
	}
	render() {
		let notes = null
		if (!this.state.fetched) {
			notes = <NoteLoad />
		}
		if (this.state.fetched) {
			notes = <span>{this.state.notes.filter((note) => {
				let combined = note.title.concat(note.content).toLowerCase()
				return combined.indexOf(this.props.archiveSearch) !== -1
			}).map(note => {
				return <Note title={note.title} date={note.updated} body={note.preview} id={note._id} key={note._id} />
			})}</span>
		}
		return (
			<div ref="mounted" style={style.cont}>
				<div style={style.inner}>
					<input onChange={this.search.bind(this)} style={style.search} placeholder="Search archived notes..." />
					{notes}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		archiveSearch: state.archiveSearch
	}
}

module.exports = connect(mapStateToProps)(Archive)