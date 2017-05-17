import React from 'react'
import {Link} from 'react-router'

const style = {
	option: {
		padding: "15px 10px",
		color: "#3c3c3c"
	},
	optionHov: {
		padding: "15px 10px",
		color: "#3c3c3c",
		backgroundColor: "#f1f1f1"
	},
	icon: {
		fontSize: "1.2rem",
		verticalAlign: "middle",
		width: "30px"
	},
	iText: {
		verticalAlign: "middle"
	},
	link: {
		textDecoration: "none"
	}
}

export default class NavTop extends React.Component {
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
			<Link style={style.link} to={this.props.link}><div onMouseEnter={this.hoverIn.bind(this)} onMouseLeave={this.hoverOut.bind(this)} style={this.state.hov ? style.optionHov : style.option}><i style={style.icon} className="material-icons">{this.props.icon}</i> <span style={style.iText}>{this.props.text}</span></div></Link>
		)
	}
}