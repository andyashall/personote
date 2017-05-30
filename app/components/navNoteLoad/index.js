import React from 'react'

const style = {
	cont: {
		width: "100%",
		boxSizing: "border-box",
		cursor: "pointer",
		backgroundColor: "#f9f9f9",
		borderBottom: "1px solid rgba(0,0,0,.08)",
		padding: "15px 10px"
	},
	hov: {
		width: "100%",
		boxSizing: "border-box",
		cursor: "pointer",
		backgroundColor: "#fff",
		borderBottom: "1px solid rgba(0,0,0,.08)",
		padding: "15px 10px"
	},
	title: {
		backgroundColor: "#f1f1f1",
		height: "1.2rem",
		marginBottom: "5px",
		width: "82%"
	},
	date: {
		backgroundColor: "#f1f1f1",
		marginBottom: "5px",
		height: ".8rem",
		width: "35%"
	},
	line1: {
		backgroundColor: "#f1f1f1",
		height: ".8rem",
		width: "92%",
		marginBottom: "2px"
	},
	line2: {
		backgroundColor: "#f1f1f1",
		height: ".8rem",
		width: "86%",
		marginBottom: "2px"
	},
	line3: {
		backgroundColor: "#f1f1f1",
		height: ".8rem",
		width: "82%",
		marginBottom: "2px"
	}
}

class NavNoteLoad extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false}
	}
	render() {
		return (
			<div  style={style.cont}>
				<div style={style.title}></div>
				<div style={style.date}></div>
				<div style={style.line1}></div>
				<div style={style.line2}></div>
				<div style={style.line3}></div>
			</div>
		)
	}
}

module.exports = NavNoteLoad