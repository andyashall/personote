import React from 'react'
import {Link} from 'react-router'

const style = {
	option: {
		fontSize: ".8rem",
		display: "inline-block",
		marginLeft: "15px",
		padding: "3px 5px",
		borderRadius: "3px",
		cursor: "pointer",
		color: "#999",
		verticalAlign: "middle"
	},
	optionHov: {
		fontSize: ".8rem",
		display: "inline-block",
		marginLeft: "15px",
		padding: "3px 5px",
		borderRadius: "3px",
		cursor: "pointer",
		color: "#3c3c3c",
		verticalAlign: "middle"
	},
	link: {
		textDecoration: "none"
	}
}

export default class HeadButton extends React.Component {
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
			<Link style={style.link} to={this.props.link}><div onMouseEnter={this.hoverIn.bind(this)} onMouseLeave={this.hoverOut.bind(this)} style={this.state.hov ? style.optionHov : style.option}>{this.props.text}</div></Link>
		)
	}
}