import React, { Component } from 'react'
import { imageMap } from './images'
import './progress.css'
import styled from 'styled-components'

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
    const cancel = this._cancel
    if(cancel) {
      this._cancel = null
      cancel()
    }
  }
  load(uri) {
    return new Promise((resolve, reject) => {
      this.cancel()
      const image = document.createElement('img')
      this._cancel = () => image.src = ''
      image.onload = () => {
        this._cancel = null
        resolve()
      }
      image.onerror = (err) => {
        this._cancel = null
        reject(err)
      }
      image.src = uri
    })
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  async init(props) {
    const { imageid } = props || this.props
    const image = imageMap[imageid]
    if(!image) return
    try {
      this.updateImage(props)
      this.setState({ uri: BLANK, opacity: 0 })
      this.setState({ loading: true })
      await this.load(image.thumbnail)
      this.setState({ opacity: 1, uri: image.thumbnail })
      await this.load(image.uri)
      this.setState({ uri: image.uri, loading: false })

    } catch(err) {
    }
  }
  updateImage(props) {
    const { width, height, imageid } = props || this.props
    const image = imageMap[imageid]
    if(!image) return
    const p = Math.min(width/image.width, height/image.height, 1)
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
    this.updateImage(nextProps)
    if(id !== nextId) {
      console.log('reload:', id, '->', nextId)
      this.init(nextProps)
    }
  }
  componentDidMount() {
    this.init()
  }
  componentWillUnmount() {
    this.cancel()
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
