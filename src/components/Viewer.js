import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from '../styles/Viewer'
import clusters from '../images'
import './progress.css'
import { withRouter } from 'react-router'

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
// const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

let _cancelLoading
const cancelLoading = () => {
  const cancelLoading = _cancelLoading
  if(cancelLoading) {
    _cancelLoading = null
    cancelLoading()
  }
}
const loadImage = (uri) => new Promise((resolve, reject) => {
  cancelLoading()
  const image = document.createElement('img')
  _cancelLoading = reject
  image.onload = () => {
    if(_cancelLoading !== reject) return
    _cancelLoading = null
    resolve()
  }
  image.onerror = () => {
    if(_cancelLoading !== reject) return
    _cancelLoading = null
    reject()
  }
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

class Viewer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onKeyDown = this.onKeyDown.bind(this)
  }
  onKeyDown(evt) {
    const { history } = this.props
    const { image } = this.state
    if(!image) return
    switch(evt.code) {
      case 'Escape':
        history.push('/')
        break
      case 'ArrowRight':
        history.push(`/${image.next ? image.next.id : ''}`)
        break
      case 'ArrowLeft':
        history.push(`/${image.prev ? image.prev.id : ''}`)
        break

      default:
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

      await loadImage(image.thumbnail)
      this.setState({ uri: image.thumbnail })

      await loadImage(image.uri)
      this.setState({ uri: image.uri, loading: false })

    } catch(err) {
    }
  }
  componentWillReceiveProps(nextProps) {
    const currentProps = this.props
    const id = currentProps.match.params.id
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
        <Link style={{ width, height }} to={`/${image.next ? image.next.id : ''}`}>
          <img alt={uri} width={width} height={height} src={uri} />
        </Link>
        { loading && <div style={style.progress} className='progress-line' /> }
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

export default withRouter(Viewer)
