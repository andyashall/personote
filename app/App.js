import React from 'react'
import { Route } from 'react-router'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import store from './store'
const state = store.getState()
import {showNav, hideNav, signIn, signOut} from './actions'

import Head from './components/head'
import Nav from './containers/nav'

import Note from './containers/note'
import Create from './containers/create'
import Signin from './containers/signin'
import Archive from './containers/archive'
import Settings from './containers/settings'
import Home from './containers/home'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {test: 'foo'}
  }
  componentWillMount() {
    let userCookie = cookie.load('user')
    if (Object.keys(this.props.user).length === 0) {
      if (userCookie) {
        store.dispatch(signIn(userCookie))
      } else {
        let rootUrl = location.protocol + '//' + location.host,
          path = location.pathname  
        store.dispatch(hideNav())
        if (path !== "/signin") {
          window.location.assign(rootUrl + "/signin")
          store.dispatch(hideNav())
        }
      }
    }
  }
  render() {
    let head = <Head />
    if (location.pathname === "/signin") {
      head = <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: "50px"}}>
                <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: ".8rem", color: "#999"}}>Personote</div>
              </div>
    }
    return (
      <div>
        <div style={{display: "flex", flexWrap: "nowrap"}}>
          <Nav />
          <div style={{position: "relative", width: "100%"}}>
            {head}
            <Route exact path="/" component={Home} />
            <Route path="/n/:id" component={Note} />
            <Route path="/new" component={Create} />
            <Route path="/signin" component={Signin} />
            <Route path="/archive" component={Archive} />
            <Route path="/settings" component={Settings} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    user: state.user
  }
}

module.exports = connect(mapStateToProps)(App)