import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Link } from 'react-router-dom'
import { imageMap } from './images'
import { withRouter } from 'react-router'
import Image from './ViewerImage'
import styled from 'styled-components'
import sleep from './sleep'

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
  transition: ${props => !props.touch ? 'transform 0.25s linear' : 'none'};
`
const CurrentImage = styled(Image)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`
const PrevImage = styled(CurrentImage)`
  transform: translate(-100%);
`
const NextImage = styled(CurrentImage)`
  transform: translate(100%);
`

class Viewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delta: 0
    }
    this.onKeyDown = ::this.onKeyDown
    this.onTouchStart = ::this.onTouchStart
    this.onTouchMove = ::this.onTouchMove
    this.onTouchEnd = ::this.onTouchEnd
    this.onTouchCancel = ::this.onTouchCancel
  }
  onTouchStart(evt) {
    const touch = evt.touches[0]
    this._x = touch.clientX
    this.setState({ touch: true })
  }
  onTouchMove(evt) {
    const touch = evt.touches[0]
    const delta = touch.clientX - this._x
    this.setState({ delta })
  }
  async onTouchEnd() {
    const { match, history } = this.props
    const { delta } = this.state
    const imageid = match.params.id
    const image = imageMap[imageid]
    const node = findDOMNode(this.refs.image)
    const rect = node.getBoundingClientRect()
    this.setState({ touch: false })

    if(delta < -50) {
      this.setState({ delta: -rect.width })
      await sleep(250)
      history.push(`/${image.next ? image.next.id : ''}`)
    } else if(delta > 50) {
      this.setState({ delta: rect.width })
      await sleep(250)
      history.push(`/${image.prev ? image.prev.id : ''}`)
    } else {
      this.setState({ delta: 0 })
    }
  }
  onTouchCancel() {
    this._touching = true
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
        history.push(`/${image.next ? image.next.id : ''}`)
        break
      case 'ArrowLeft':
        history.push(`/${image.prev ? image.prev.id : ''}`)
        break

      default:
        break
    }
  }
  componentDidMount() {
    document.body.addEventListener('keydown', this.onKeyDown)
    document.body.style.overflow = 'hidden'
  }
  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown)
    document.body.style.overflow = 'auto'
  }
  async componentWillReceiveProps(nextProps) {
    if(nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({ touch: true, delta: 0 })
      await sleep(0)
      this.setState({ touch: false })
    }
  }
  render() {
    const { touch, delta } = this.state
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
        <ImageContainer ref='image' touch={touch} delta={delta}>
          { image.prev && <PrevImage imageid={image.prev.id} /> }
          <CurrentImage imageid={imageid} />
          { image.next && <NextImage imageid={image.next.id} /> }
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
