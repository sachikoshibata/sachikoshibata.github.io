import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { imageMap } from './images'
import './progress.css'
import styled from 'styled-components'
import sleep from './sleep'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Progress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export default class ViewerImage extends Component {

  cancel() {
    const canceller = this._canceller
    if(canceller) {
      this._canceller = null
      canceller()
    }
  }
  load(uri) {
    return new Promise((resolve, reject) => {
      this.cancel()
      const image = document.createElement('img')
      this._canceller = reject
      image.onload = () => {
        if(this._canceller !== reject) return
        this._canceller = null
        resolve()
      }
      image.onerror = () => {
        if(this._canceller !== reject) return
        this._canceller = null
        reject(new Error(`canceled:${uri}`))
      }
      image.src = uri
    })
  }
  constructor(props) {
    super(props)
    this.state = {}
    this.onResize = ::this.onResize
  }
  async loadImage() {
    this.setState({ uri: BLANK })
    await sleep(0)
    const { imageid } = this.props
    const image = imageMap[imageid]
    if(!image) return
    try {
      this.updateImage()
      this.setState({ uri: BLANK, opacity: 0, loading: true })
      await this.load(image.thumbnail)
      this.setState({ opacity: 1, uri: image.thumbnail })
      await this.load(image.uri)
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
  componentWillReceiveProps(nextProps) {
    const currentProps = this.props
    const id = currentProps.imageid
    const nextId = nextProps.imageid
    if(id !== nextId) {
      this.loadImage()
    }
  }
  componentDidMount() {
    this.loadImage()
    window.addEventListener('resize', this.onResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }
  render() {
    const { imageid, style, ...props } = this.props
    const { opacity, loading, uri, width, height, image } = this.state
    return (
      <Container style={style} {...props}>
        { image &&
          <div style={{backgroundColor: image.color}}>
            <img style={{ opacity, display: 'block' }} alt={uri} width={width} height={height} src={uri} />
          </div>
        }
        { loading && <Progress className='progress-line' /> }
      </Container>
    )
  }
}
