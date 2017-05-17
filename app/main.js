import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import App from './App.js'
import Note from './containers/note'
import Create from './containers/create'
import Signin from './containers/signin'
import Archive from './containers/archive'
import Settings from './containers/settings'
import Home from './containers/home'

import store from './store'

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Home} />
				<Route path="/n/:id" component={Note} />
				<Route path="/new" component={Create} />
				<Route path="/signin" component={Signin} />
				<Route path="/archive" component={Archive} />
				<Route path="/settings" component={Settings} />
			</Route>
		</Router>
	</Provider>
	, document.getElementById('root'))
