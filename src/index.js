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
    <div>
      <Route exact path='/' component={App} />
      <Route path='/:id' component={Viewer} />
    </div>
  </Router>
  , document.getElementById('root'))

registerServiceWorker()
