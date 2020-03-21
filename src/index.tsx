import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { HashRouter as Router } from 'react-router-dom'
import App from './App'
import Viewer from './Viewer'

ReactDOM.render(
  <Router>
    <App>
      <Route path='/:id' component={Viewer} />
    </App>
  </Router>
  , document.getElementById('root'))
