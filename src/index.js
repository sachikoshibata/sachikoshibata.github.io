import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { HashRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App'
import Viewer from './Viewer'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Router>
    <App>
      <Route path='/:id' component={Viewer} />
    </App>
  </Router>
  , document.getElementById('root'))

registerServiceWorker()
