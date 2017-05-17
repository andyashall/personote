import React from 'react'

const style = {
	option: {
		fontSize: ".8rem",
		display: "inline-block",
		marginRight: "10px",
		padding: "3px 5px",
		borderRadius: "3px",
		cursor: "pointer"
	},
	optionHov: {
		fontSize: ".8rem",
		display: "inline-block",
		marginRight: "10px",
		padding: "3px 5px",
		borderRadius: "3px",
		cursor: "pointer",
		backgroundColor: "#f1f1f1"
	},
	icon: {
		fontSize: "1rem",
		verticalAlign: "middle"
	},
	iText: {
		verticalAlign: "middle"
	},
	link: {
		textDecoration: "none"
	}
}

export default class NoteButton extends React.Component {
	constructor(props) {
		super(props)
		this.state = {hov: false}
	}
	hoverIn(e) {
		this.setState({hov: true})
	}
	hoverOut(e) {
		this.setState({hov: false})
	}
	render() {
		return (
			<div onClick={this.props.onClick} onMouseEnter={this.hoverIn.bind(this)} onMouseLeave={this.hoverOut.bind(this)} style={this.state.hov ? style.optionHov : style.option}><i style={style.icon} className="material-icons">{this.props.icon}</i> <span style={style.iText}>{this.props.text}</span></div>
		)
	}
}