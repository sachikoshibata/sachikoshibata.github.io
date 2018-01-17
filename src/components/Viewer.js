import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { imageMap } from '../images'
import { withRouter } from 'react-router'
import Image from './ViewerImage'
import styled from 'styled-components'

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
`
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
const CurrentImage = styled(Image)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`

class Viewer extends Component {
  constructor(props) {
    super(props)
    this.onKeyDown = ::this.onKeyDown
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
  }
  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown)
  }
  render() {
    const { match } = this.props
    const imageid = match.params.id
    const image = imageMap[imageid]
    return (
      <Container>
        <ImageContainer>
          <CurrentImage imageid={imageid} />
        </ImageContainer>
        <NaviContainer>
          { image && image.prev && <Navi to={`/${image.prev.id}`}>←</Navi> }
          { image && image.next && <Navi to={`/${image.next.id}`}>→</Navi> }
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
