import React from 'react'
import ContentEditable from 'react-contenteditable'
import {connect} from 'react-redux'
import axios from 'axios'
import store from '../../store'
const state = store.getState()

import { addNote, updateNotes } from '../../actions'

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
		backgroundColor: "#fff",
		// marginLeft: "300px"
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
		outline: "none"
	},
	controls: {
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

class Create extends React.Component {
	constructor(props) {
		super(props)
		this.state = {writing: false, title: "", content: "", nav: props.nav, created: false, saved: false, nid: ""}
	}
	componentWillMount() {

	}
	titleChange(e) {
		this.setState({title: e.target.value, saved: false})
	}
	bodyChange(e) {
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
		}, 1000)
	}
	keyDown() {
		clearTimeout(timer)
	}
	save() {
		if (!this.state.created) {
			this.setState({saving: true})
			let prev = this.state.content.substring(0, 300).replace(/<(?:.|\n)*?>/gm, '')
			let data = {
				title: this.state.title,
				content: this.state.content,
				preview: prev,
				userId: store.getState().user.userId
			}
			axios.post("/api/newnote", data)
			.then((res) => {
				let newNote = {
					title: this.state.title,
					content: this.state.content,
					preview: prev,
					_id: res.data.nid,
					updated: new Date()
				}
				store.dispatch(addNote(store.getState().notes, newNote))
				this.setState({
					nid: res.data.nid,
					created: true,
					saved: true
				})
			})
			.catch((err) => {
				console.log(err)
			})
		}
		if (!this.state.saved) {
			this.setState({saving: true})
			let prev = this.state.content.substring(0, 300).replace(/<(?:.|\n)*?>/gm, '')
			let data = {
				title: this.state.title,
				content: this.state.content,
				preview: prev,
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
				let current = store.getState().notes
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
						{status}
						{icon}
					</div>	
					<input style={style.title} onChange={this.titleChange.bind(this)} onKeyUp={this.keyUp.bind(this)} onKeyDown={this.keyDown.bind(this)} placeholder="Title..." />
					<ContentEditable id="body" onChange={this.bodyChange.bind(this)} onKeyUp={this.keyUp.bind(this)} onKeyDown={this.keyDown.bind(this)} html={this.state.content} style={style.textArea} />
				{/*	<TinyMCE onChange={this.bodyChange.bind(this)} config={{plugins: "autoresize autolink link image lists textcolor colorpicker", toolbar: "", themes: "modern", skin: ''}} /> */}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav
  }
}

module.exports = connect(mapStateToProps)(Create);