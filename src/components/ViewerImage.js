import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import style from '../styles/ViewerImage'
import { imageMap } from '../images'
import './progress.css'

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))
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
    reject(new Error(`canceled:${uri}`))
  }
  image.src = uri
})

export default class ViewerImage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onResize = ::this.onResize
  }
  async loadImage() {
    const { imageid } = this.props
    const image = imageMap[imageid]
    if(!image) return
    try {
    this.updateImage()
      this.setState({ uri: BLANK, opacity: 0, loading: true })
      await loadImage(image.thumbnail)
      this.setState({ opacity: 1, uri: image.thumbnail })
      await loadImage(image.uri)
      this.setState({ uri: image.uri, loading: false })

    } catch(err) {
    }
  }
  onResize() {
    this.updateImage()
  }
  updateImage() {
    const { imageid } = this.props
    const node = findDOMNode(this)
    const rect = node.getBoundingClientRect()
    const image = imageMap[imageid]
    if(!image) return
    const p = Math.min(rect.width/image.width, rect.height/image.height, 1)
    this.setState({
      image,
      width: image.width * p,
      height: image.height * p,
    })
  }
  async componentWillReceiveProps(nextProps) {
    const currentProps = this.props
    const id = currentProps.imageid
    const nextId = nextProps.imageid
    if(id !== nextId) {
      await sleep(0)
      this.loadImage()
    }
  }
  componentDidMount() {
    const { imageid } = this.props
    this.loadImage(imageid)
    window.addEventListener('resize', this.onResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }
  render() {
    const { imageid, style: _style, ...props } = this.props
    const { opacity, loading, uri, width, height, image } = this.state
    return (
      <div style={{ ...style.component, ..._style }} {...props}>
        { image &&
          <div style={{backgroundColor: image.color}}>
            <img style={{ opacity, display: 'block' }} alt={uri} width={width} height={height} src={uri} />
          </div>
        }
        { loading && <div style={style.progress} className='progress-line' /> }
      </div>
    )
  }
}
