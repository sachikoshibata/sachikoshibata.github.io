import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from '../styles/Viewer'
import { imageMap } from '../images'
import { withRouter } from 'react-router'
import Image from './ViewerImage'

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
      <div style={style.component}>
        <div style={style.imageContainer}>
          <Image style={style.imageCurrent} imageid={imageid} />
        </div>
        <div style={style.navi}>
          { image && image.prev && <Link style={style.naviItem} to={`/${image.prev.id}`}>←</Link> }
          { image && image.next && <Link style={style.naviItem} to={`/${image.next.id}`}>→</Link> }
          <Link style={style.naviItem} to='/'>x</Link>
        </div>
        { image &&
            <div style={style.info}>
              <b>{image.info.title}</b>&nbsp;{image.info.description}
            </div>
        }
      </div>
    )
  }
}

export default withRouter(Viewer)
