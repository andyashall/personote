import React from 'react'
import Head from './components/head'
import Nav from './containers/nav'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {test: 'foo'}
  }
  render() {
    return (
      <div>
        <div style={{display: "flex", flexWrap: "nowrap"}}>
          <Nav />
          <div style={{position: "relative", width: "100%"}}>
            <Head />
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
