import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Link } from 'react-router-dom'
import { imageList, imageMap } from './images'
import { withRouter } from 'react-router'
import ViewerImage from './ViewerImage'
import styled from 'styled-components'
import sleep from './sleep'
import throttle from 'lodash/throttle'

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: black;
`
const NaviContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
`
const Navi = styled(Link)`
  display: flex;
  width: 16px;
  height: 16px;
  background-color: #fff;
  margin-left: 10px;
  padding: 5px;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 16pc;
  font-family: monospace;
`
const ImageContainer = styled.div.attrs({
  style: props => ({
    transform: `translateX(${props.delta}px)`
  })
})`
  position: relative;
  width: 100%;
  height: 100%;
  transition: ${props => !props.touch ? 'transform 150ms' : 'none'};
`
const Image = styled(ViewerImage).attrs({
  style: props => ({
    transform: `translateX(${props.index * 100}%)`
  })
})`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`

class Viewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delta: 0,
      touch: true
    }
    this.onKeyDown = ::this.onKeyDown
    this.onTouchStart = ::this.onTouchStart
    this.onTouchMove = ::this.onTouchMove
    this.onTouchEnd = ::this.onTouchEnd
    this.onTouchCancel = ::this.onTouchCancel
    this.onResize = throttle(this.onResize.bind(this), 250, { leading: false })
  }
  onTouchStart(evt) {
    if(this._locked) return
    const touch = evt.touches[0]
    this._x = touch.clientX

    this.setState({ touch: true })
  }
  onTouchMove(evt) {
    if(this._locked) return
    const touch = evt.touches[0]
    const delta = touch.clientX - this._x
    this.setState({ delta })
  }
  async onTouchEnd() {
    if(this._locked) return

    this.setState({ touch: false })

    const { match, history } = this.props
    const { width, delta } = this.state
    const imageid = match.params.id
    const image = imageMap[imageid]
    this._locked = true
    if(delta < -100) {
      this.setState({ delta: -width })
      await sleep(250)
      history.push(`/${image.next ? image.next.id : ''}`)
    } else if(delta > 100) {
      this.setState({ delta: width })
      await sleep(250)
      history.push(`/${image.prev ? image.prev.id : ''}`)
    } else {
      this.setState({ delta: 0 })
    }
    this._locked = false
  }
  onTouchCancel() {
  }
  onKeyDown(evt) {
    const { match, history } = this.props
    const imageid = match.params.id
    const image = imageMap[imageid]
    if(!image) return
    switch(evt.code) {
      case 'Escape':
        history.push('/')
        break
      case 'ArrowRight':
        if(!evt.metaKey) history.push(`/${image.next ? image.next.id : ''}`)
        break
      case 'ArrowLeft':
        if(!evt.metaKey) history.push(`/${image.prev ? image.prev.id : ''}`)
        break

      default:
        break
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    document.body.addEventListener('keydown', this.onKeyDown)
    document.body.style.overflow = 'hidden'
    this.updateWidth()
  }
  onResize() {
    this.updateWidth()
  }
  updateWidth() {
    const node = findDOMNode(this.refs.image)
    const { width, height } = node.getBoundingClientRect()
    this.setState({ width, height })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    document.body.removeEventListener('keydown', this.onKeyDown)
    document.body.style.overflow = 'auto'
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({ delta: 0 })
    }
  }
  render() {
    const { touch, width, height, delta } = this.state
    const { match } = this.props
    const imageid = match.params.id
    const image = imageMap[imageid]
    return (
      <Container
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        onTouchCancel={this.onTouchCancel}
      >
        <ImageContainer ref='image' touch={touch} delta={-width * image.index + delta}>
          { width && height && imageList.map((img, i) => 
            (image === img || image.next === img || image.prev === img) &&
            <Image
              key={i}
              index={img.index}
              imageid={img.id}
              width={width}
              height={height}
            />
          )}
        </ImageContainer>
        <NaviContainer>
          { image && image.prev && <Navi to={`/${image.prev.id}`}>&lt;</Navi> }
          { image && image.next && <Navi to={`/${image.next.id}`}>&gt;</Navi> }
          <Navi to='/'>x</Navi>
        </NaviContainer>
        {/* image &&
            <div style={style.info}>
              <b>{image.info.title}</b>&nbsp;{image.info.description}
            </div>
        */}
      </Container>
    )
  }
}

export default withRouter(Viewer)
