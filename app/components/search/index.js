import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import store from '../../store'
const state = store.getState()
import {searchNotes} from '../../actions'

const style = {
	search: {
		padding: "18px 10px",
		color: "#3c3c3c",
		boxSizing: "border-box",
		width: "100%",
		border: "none",
		outline: "none"
	},
	searchHov: {
		margin: "15px 10px",
		color: "#3c3c3c",
		backgroundColor: "#f1f1f1"
	}
}

class Search extends React.Component {
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
	search(e) {
		store.dispatch(searchNotes(e.target.value.toLowerCase()))
	}
	render() {
		return (
			<div>
				<input onChange={this.search.bind(this)} placeholder="Search notes..." style={style.search} />
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    search: state.search
  }
}

module.exports = connect(mapStateToProps)(Search)