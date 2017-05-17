import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import ContentEditable from 'react-contenteditable'
import store from '../../store'
const state = store.getState()
import NoteButton from '../../components/noteButton'

import { saveNote, updateNote, removeNote } from '../../actions'

const style = {
	note: {
		marginTop: "50px",
		minHeight: "calc(100vh - 50px)",
		backgroundColor: "#fff",
		width: "100%"
	},
	noteNav: {
		marginTop: "50px",
		minHeight: "calc(100vh - 50px)",
		backgroundColor: "#fff"
	},
	inner: {
		width: "700px",
		position: "relative",
		left: "50%",
		transform: "translateX(-50%)",
		padding: "2rem 0",
		boxSizing: "border-box"
	},
	title : {
		border: "none",
		borderBottom: "1px solid rgba(0,0,0,.08)",
		boxSizing: "border-box",
		width: "100%",
		fontSize: "2rem",
		marginTop: "5px",
		padding: "8px 0",
		outline: "none"
	},
	textArea: {
		width: "100%",
		boxSizing: "border-box",
		padding: "1rem 3px",
		border: "none",
		height: "auto",
		minHeight: "500px",
		fontFamily: "helvetica",
		fontSize: "1rem",
		lineHeight: "1.4",
		outline: "none"
	},
	controls: {
		display: "flex"
	},
	contLeft: {
		width: "50%",
		color: "#777",
		marginLeft: "-5px"
	},
	contRight: {
		width: "50%",
		textAlign: "right"
	},
	save: {
		marginBottom: "1rem"
	},
	statusSaved: {
		display: "inline-block",
		marginRight: "5px",
		color: "green",
		verticalAlign: "middle",
		fontSize: ".8rem"
	},
	statusNot: {
		display: "inline-block",
		marginRight: "5px",
		color: "red",
		fontSize: ".8rem"
	},
	iconSaved: {
		display: "inline-block",
		color: "green"
	},
	iconNot: {
		display: "inline-block",
		color: "red"
	},
	icon: {
		fontSize: "1rem",
		verticalAlign: "middle"
	}
}

let timer

class Note extends React.Component {
	constructor(props) {
		super(props)
		this.state = {writing: false, title: "Loading...", content: "Loading...", nav: props.nav, note: props.note, saved: true}
		store.subscribe(() => {
			this.setState({
				title: store.getState().note.title,
				content: store.getState().note.content,
				nid: store.getState().note._id,
				saved: true
			})
		})
		this.titleChange = this.titleChange.bind(this)
		this.bodyChange = this.bodyChange.bind(this)
	}
	componentDidMount() {
		if (this.props.note._id !== this.props.location.pathname.replace("/n/", "")) {
    		this.getNote(this.props.location.pathname.replace("/n/", ""))
    	}else if (Object.keys(this.props.note).length !== 0) {
    	  this.setState({title: this.props.note.title, content: this.props.note.content})
    	}
	}
	getNote(path) {
		let user = {}
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = store.getState().user.userId
    	} else if (cookie.load('user')) {
    	  user = cookie.load('user').userId
    	} 
		axios.get("/api/getnote", {
			params: {
				nid: path,
				uid: user
			}
		})
		.then((res) => {
			this.setState({
				title: res.data.title,
				content: res.data.content
			})
			store.dispatch(saveNote(res.data))
		})
		.catch((err) => {
			console.log(err)
		})
	}
	titleChange(e) {
		this.setState({title: e.target.value, saved: false})
		// this.start()
	}
	bodyChange(e) {
		let timer
		let body = document.getElementById("body")
		this.setState({content: e.target.value, saved: false})
	}
	keyUp() {
		if (!this.state.writing) {
				console.log("change")
				this.setState({writing: true})
		}
		clearTimeout(timer)
		timer = setTimeout(() => {
			if (!this.state.saved && this.state.writing) {
				this.setState({writing: false})
				this.save()
				console.log("saving...")
			}
		}, 3000)
	}
	keyDown() {
		clearTimeout(timer)
	}
	save() {
		if (!this.state.saved) {
			this.setState({saving: true})
			let prev = this.state.content.substring(0, 300).replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/g, " ")
			let data = {
				title: this.state.title,
				preview: prev,
				content: this.state.content,
				nid: this.state.nid,
				userId: store.getState().user.userId
			}
			axios.post("/api/savenote", data)
			.then((res) => {
				this.setState({
					saved: true,
					saving: false
				})
				let newNote = {
					title: this.state.title,
					content: this.state.content,
					preview: prev,
					_id: this.state.nid
				}
				store.dispatch(updateNote(store.getState().notes, newNote))
			})
			.catch((err) => {
				console.log(err)
			})			
		}
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
	archiveNote() {
		let data = {
			nid: this.props.note._id,
			uid: store.getState().user.userId
		}
		axios.post('/api/archivenote', data)
		.then((res) => {
			if (res.status === 200) {
				store.dispatch(removeNote(store.getState().notes, this.props.note))
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}
	deleteNote() {
		if (confirm("Are you sure? This can't be undone!")) {
			let data = {
				nid: this.props.note._id,
				uid: store.getState().user.userId
			}
			axios.post('/api/deletenote', data)
			.then((res) => {
				if (res.status === 200) {
					store.dispatch(removeNote(store.getState().notes, this.props.note))
				}
			})
			.catch((err) => {
				console.log(err)
			})
		} else {
			return
		}
	}
	render() {
		let status = null,
			icon = null
		if (this.state.saving) {
 			status = <div style={style.statusSaved}>Saving...</div>
 			icon = <div style={style.iconSaved}><i style={style.icon} className="material-icons">save</i></div>
		} else if (this.state.saved) {
			status = <div style={style.statusSaved}>Saved</div>
			icon = <div style={style.iconSaved}><i style={style.icon} className="material-icons">check_circle</i></div>
		} else {
			status = <div style={style.statusNot}>Changes not saved</div>
			icon = <div style={style.iconNot}><i style={style.icon} className="material-icons">close</i></div>
		}
		return (
			<div style={style.note}>
				<div style={style.inner}>
					<div style={style.controls}>
						<div style={style.contLeft}>
							<NoteButton icon="archive" text="Archive note" onClick={this.archiveNote.bind(this)} />
							<NoteButton icon="delete" text="Delete note" onClick={this.deleteNote.bind(this)} />
						</div>
						<div style={style.contRight}>
							{status}
							{icon}
						</div>
					</div>	
					<input style={style.title} onChange={this.titleChange} onKeyUp={this.keyUp.bind(this)} onKeyDown={this.keyDown.bind(this)} value={this.state.title} />
					<ContentEditable id="body" onChange={this.bodyChange} onKeyUp={this.keyUp.bind(this)} onKeyDown={this.keyDown.bind(this)} html={this.state.content} style={style.textArea} />
				{/*	<TinyMCE content={this.state.content} onChange={this.bodyChange} config={{plugins: "autoresize autolink link image lists textcolor colorpicker", toolbar: "", themes: "modern", skin: ''}} /> */}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    note: state.note,
    user: state.user
  }
}

module.exports = connect(mapStateToProps)(Note)