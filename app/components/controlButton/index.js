import React from 'react'

const style = {
	option: {
		fontSize: ".8rem",
		display: "inline-block",
		marginRight: "10px",
		padding: "3px 5px",
		borderRadius: "3px",
		cursor: "pointer",
		color: "#777",
		border: "none",
		backgroundColor: "transparent",
		outline: "none"
	},
	optionHov: {
		fontSize: ".8rem",
		display: "inline-block",
		marginRight: "10px",
		padding: "3px 5px",
		borderRadius: "3px",
		cursor: "pointer",
		backgroundColor: "#f1f1f1",
		border: "none",
		color: "#777",
		outline: "none"
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

export default class ControlButton extends React.Component {
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
			<button onClick={this.props.onClick} onMouseEnter={this.hoverIn.bind(this)} onMouseLeave={this.hoverOut.bind(this)} style={this.state.hov ? style.optionHov : style.option}><i style={style.icon} className="material-icons">{this.props.icon}</i> <span style={style.iText}>{this.props.text}</span></button>
		)
	}
}