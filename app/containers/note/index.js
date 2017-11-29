import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import ContentEditable from 'react-contenteditable'
import cookie from 'react-cookie'
import store from '../../store'
const state = store.getState()
import NoteButton from '../../components/noteButton'
import ControlButton from '../../components/controlButton'

import { saveNote, addNote, updateNotes } from '../../actions'

let resp = {
	inner: {
		width: "700px",
		position: "relative",
		left: "50%",
		transform: "translateX(-50%)",
		padding: "2rem 0",
		boxSizing: "border-box"
	}
}

if (window.innerWidth <= 700) {
	resp.inner = {
		mergin: "0 20px",
		minWidth: "300px",
		position: "relative",
		left: "50%",
		transform: "translateX(-50%)",
		padding: "2rem 20px",
		boxSizing: "border-box"		
	}
}

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
	title : {
		border: "none",
		borderBottom: ".5px solid rgba(0,0,0,.08)",
		boxSizing: "border-box",
		width: "100%",
		fontSize: "2rem",
		marginTop: "2px",
		padding: "8px 0",
		outline: "none",
		color: "#1c1c1c"
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
		outline: "none",
		color: "#1c1c1c"
	},
	controls: {
		display: "flex",
		top: 0,
		padding: "3px 0",
		position: "sticky",
		backgroundColor: "#fff",
		whiteSpace: "nowrap",
		marginLeft: "-5px"
	},
	contLeft: {
		width: "50%",
		color: "#777",
		marginLeft: "-2px"
	},
	contRight: {
		width: "50%",
		textAlign: "right"
	},
	statusCont: {
		padding: "3px",
		display: "inline-block"
	},
	statusSaved: {
		display: "inline-block",
		marginRight: "2px",
		color: "green",
		verticalAlign: "middle",
		fontSize: ".8rem"
	},
	statusNot: {
		display: "inline-block",
		marginRight: "2px",
		color: "red",
		fontSize: ".8rem"
	},
	iconSaved: {
		display: "inline-block",
		color: "green",
		verticalAlign: "text-bottom"
	},
	iconNot: {
		display: "inline-block",
		color: "red"
	},
	icon: {
		fontSize: "1rem",
		verticalAlign: "middle"
	},
	noteControls: {
		padding: "5px",
		borderBottom: "1px solid rgba(0,0,0,.08)",
		borderLeft: "1px solid rgba(0,0,0,.08)",
		borderRight: "1px solid rgba(0,0,0,.08)",
		backgroundColor: "#f9f9f9",
		top: "30px",
		padding: "3px 0",
		position: "sticky"
	},
	noteControlsHide: {
		display: "none"
	}
}

let timer

class Note extends React.Component {
	constructor(props) {
		super(props)
		this.state = {writing: false, title: "Loading...", content: "Loading...", saved: true, nid: this.props.note._id}
	}
	componentWillMount() {
		if (this.props.note._id !== this.props.location.pathname.replace("/n/", "")) {
    		this.getNote(this.props.location.pathname.replace("/n/", ""))
    	}else if (Object.keys(this.props.note).length !== 0) {
    	  this.setState({title: this.props.note.title, content: this.props.note.content})
    	}
		store.subscribe(() => {
			if (this.refs.mounted) {
				this.setState({
					title: store.getState().note.title,
					content: store.getState().note.content,
					nid: store.getState().note._id,
					archived: store.getState().note.archived,
					saved: true
				})
			}
		})
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname !== this.props.location.pathname) {
			let _id = nextProps.location.pathname.replace("/n/", "")
			let note = this.props.notes.find((e) => {return e._id == _id})
			store.dispatch(saveNote(note))
		}
	}
	getNote(path) {
		let user = ""
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = this.props.user.userId
    	} else if (cookie.load('user')) {
    	  user = cookie.load('user').userId
    	} else {
    		return
    	}
		axios.get("/api/getnote", {
			params: {
				nid: path,
				uid: user
			}
		})
		.then((res) => {
			store.dispatch(saveNote(res.data))
		})
		.catch((err) => {
			console.log(err)
		})
	}
	titleChange(e) {
		this.setState({title: e.target.value, saved: false})
	}
	bodyChange(e) {
		let body = document.getElementById("body")
		this.setState({content: e.target.value, saved: false})
	}
	keyUp() {
		if (!this.state.writing) {
				this.setState({writing: true})
		}
		clearTimeout(timer)
		timer = setTimeout(() => {
			if (!this.state.saved && this.state.writing) {
				this.setState({writing: false})
				this.save()
			}
		}, 500)
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
				userId: this.props.user.userId
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
				store.dispatch(saveNote(newNote))
				let current = this.props.notes
				Object.keys(current).forEach((i) => {
					if (current[i]._id == newNote._id) {
						current[i].title = newNote.title
						current[i].content = newNote.content
						current[i].preview = newNote.preview
						current[i].updated = new Date()
						store.dispatch(updateNotes(current))
					}
				})
			})
			.catch((err) => {
				console.log(err)
			})			
		}
	}
	getNotes() {
		let user = ""
    	if (Object.keys(this.props.user).length !== 0) {
    	  user = this.props.user.userIdupdateNotes
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
			uid: this.props.user.userId
		}
		axios.post('/api/archivenote', data)
		.then((res) => {
			if (res.status === 200) {
					let current = store.getState().notes,
						lim = Object.keys(current).length
					Object.keys(current).forEach((i) => {
						if (current[i]._id === this.props.note._id) {
							current[i].archived = true
							current.splice(i,1)
							store.dispatch(updateNotes(current))
						}
					})	
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}
	unarchiveNote() {
		let data = {
			nid: this.props.note._id,
			uid: this.props.user.userId
		}
		axios.post('/api/unarchivenote', data)
		.then((res) => {
			if (res.status === 200) {
				this.props.note.archived = false
				store.dispatch(addNote(store.getState().notes, this.props.note))
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
				uid: this.props.user.userId
			}
			axios.post('/api/deletenote', data)
			.then((res) => {
				if (res.status === 200) {
					let current = store.getState().notes,
						lim = Object.keys(current).length
					Object.keys(current).forEach((i) => {
						if (current[i]._id === this.props.note._id) {
							current.splice(i,1)
							store.dispatch(updateNotes(current))
							window.location.assign(location.protocol + '//' + location.host)
						}
					})	
				}
			})
			.catch((err) => {
				console.log(err)
			})
		} else {
			return
		}
	}
	insertTodoAtCursor() { 
	   let sel = window.getSelection()
	   let range = sel.getRangeAt(0) 
	   range.deleteContents() 
	   let check = document.createElement("INPUT")
	   check.type = 'checkbox'
	   range.insertNode(check)
	   sel.removeAllRanges()
	   sel.addRange(range)       
	}
	insertListAtCursor() { 
	   let sel = window.getSelection()
	   let range = sel.getRangeAt(0) 
	   range.deleteContents() 
	   let ul = document.createElement("UL")
	   let list = document.createElement("LI")
	   ul.append(list)
	   range.insertNode(ul)
	   sel.removeAllRanges()
	   sel.addRange(range)       
	}
	insertCodeAtCursor() { 
	   let sel = window.getSelection()
	   let range = sel.getRangeAt(0) 
	   range.deleteContents() 
	   let pre = document.createElement("PRE")
	   let code = document.createElement("CODE")
	   pre.style.backgroundColor = '#f9f9f9'
	   pre.style.padding = '15px 20px'
	   pre.style.fontSize = '.8rem'
	   pre.style.color = '#555'
	   pre.style.border = '1px solid rgba(0, 0, 0, 0.08)'
	   code.append("text")
	   pre.append(code)
	   range.insertNode(pre)
	   sel.removeAllRanges()
	   sel.addRange(range)       
	}
	render() {
		let status = null,
			icon = null,
			archiveButton = null
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
		if (this.state.archived) {
			archiveButton = <NoteButton icon="unarchive" text="Unarchive note" onClick={this.unarchiveNote.bind(this)} />
		} else {
			archiveButton = <NoteButton icon="archive" text="Archive note" onClick={this.archiveNote.bind(this)} />
		}
		return (
			<div ref="mounted" style={style.note}>
				<div style={resp.inner}>
					<div style={style.controls}>
						<div style={style.contLeft}>
							{archiveButton}
							<NoteButton icon="delete" text="Delete note" onClick={this.deleteNote.bind(this)} />
						</div>
						<div style={style.contRight}>
							<div style={style.statusCont}>
								{status}
								{icon}
							</div>
						</div>
					</div>	
					<input style={style.title} onChange={this.titleChange.bind(this)} onKeyUp={this.keyUp.bind(this)} onKeyDown={this.keyDown.bind(this)} value={this.state.title} />
					<div style={this.props.editor ? style.noteControls : style.noteControlsHide}>
						<ControlButton onClick={this.insertTodoAtCursor.bind(this)} icon="check_box" text="Todo" />
						<ControlButton onClick={this.insertListAtCursor.bind(this)} icon="list" text="List" />
						<ControlButton onClick={this.insertCodeAtCursor.bind(this)} icon="code" text="Code" />
					</div>
					<ContentEditable id="body" onChange={this.bodyChange.bind(this)} onKeyUp={this.keyUp.bind(this)} onKeyDown={this.keyDown.bind(this)} html={this.state.content} style={style.textArea} />
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    note: state.note,
    user: state.user,
    editor: state.editor,
    notes: state.notes
  }
}

module.exports = connect(mapStateToProps)(Note)