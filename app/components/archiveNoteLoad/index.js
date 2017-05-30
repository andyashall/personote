import React from 'react'

const style = {
	cont: {
		width: "100%",
		boxSizing: "border-box",
		cursor: "pointer",
		backgroundColor: "#fff",
		padding: "15px 10px"
	},
	title: {
		backgroundColor: "#f1f1f1",
		height: "1rem",
		width: "30%",
		marginBottom: "5px"
	},
	date: {
		backgroundColor: "#f1f1f1",
		marginBottom: "5px",
		height: ".8rem",
		width: "10%"
	},
	line1: {
		backgroundColor: "#f1f1f1",
		height: ".8rem",
		width: "90%",
		marginBottom: "2px"
	},
	line2: {
		backgroundColor: "#f1f1f1",
		height: ".8rem",
		width: "85%",
		marginBottom: "2px"
	},
	line3: {
		backgroundColor: "#f1f1f1",
		height: ".8rem",
		width: "68%",
		marginBottom: "2px"
	}
}

export default class NoteLoad extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false}
	}
	render() {
		return (
			<div style={style.cont}>
				<div style={style.title}></div>
				<div style={style.date}></div>
				<div style={style.line1}></div>
				<div style={style.line2}></div>
				<div style={style.line3}></div>
			</div>
		)
	}
}