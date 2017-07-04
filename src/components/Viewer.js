import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import style from '../styles/Viewer'
import clusters from '../images'
import './progress.css'

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))
const loadImage = uri => new Promise((resolve, reject) => {
  const image = document.createElement('img')
  image.onload = resolve
  image.onerror = reject
  image.src = uri
})

const imageMap = {}
let prev
clusters.forEach(cluster => {
  cluster.images.forEach(image => {
    if(prev) {
      image.prev = prev
      prev.next = image
    }
    imageMap[image.id] = image
    prev = image
  })
})

export default class Viewer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onKeyDown = this.onKeyDown.bind(this)
  }
  onKeyDown(evt) {
    const { image } = this.state
    if(!image) return
    switch(evt.code) {
      case 'ArrowRight':
        this.context.router.history.push(`/${image.next ? image.next.id : ''}`)
        break
      case 'ArrowLeft':
        this.context.router.history.push(`/${image.prev ? image.prev.id : ''}`)
        break
    }
  }
  async updateImage(id) {
    try {
      const image = imageMap[id]
      const p = Math.min(window.innerWidth/image.width, window.innerHeight/image.height, 1)
      this.setState({
        image,
        uri: BLANK,
        width: image.width * p,
        height: image.height * p,
        loading: true
      })
      await sleep(100)
      if(this.props.match.params.id !== id) return
      this.setState({ uri: image.thumbnail })
      await loadImage(image.uri)
      if(this.props.match.params.id !== id) return
      this.setState({
        uri: image.uri,
        loading: false
      })
    } catch(err) {
    }
  }
  componentWillReceiveProps(nextProps) {
    const id = this.props.match.params.id
    const nextId = nextProps.match.params.id
    if(id !== nextId) this.updateImage(nextId)
  }
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id
    this.updateImage(id)
    document.body.addEventListener('keydown', this.onKeyDown)
  }
  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown)
  }
  render() {
    const { loading, uri, width, height, image } = this.state
    if(!image) return false
    return (
      <div style={style.component}>
        <img width={width} height={height} src={uri} />
        { loading && <div style={style.progress} className='progress-line' /> }
        <Link style={style.cover} to={`/${image.next ? image.next.id : ''}`}/>
        <div style={style.navi_left}>
          { image.prev && <Link style={style.naviItem} to={`/${image.prev.id}`}>←</Link> }
        </div>
        <div style={style.navi}>
          { image.next && <Link style={style.naviItem} to={`/${image.next.id}`}>→</Link> }
          <Link style={style.naviItem} to='/'>x</Link>
        </div>
        <div style={style.info}>
          <b>{image.info.title}</b>&nbsp;{image.info.description}
        </div>
      </div>
    )
  }
}
Viewer.contextTypes = {
  router: PropTypes.object.isRequired
}
