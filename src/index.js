import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { HashRouter as Router } from 'react-router-dom'
import './index.css'
import App from './components/App'
import Viewer from './components/Viewer'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Router>
    <App>
      <Route path='/:id' component={Viewer} />
    </App>
  </Router>
  , document.getElementById('root'))

registerServiceWorker()
