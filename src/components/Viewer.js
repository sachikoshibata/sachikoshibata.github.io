import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from '../styles/Viewer'
import clusters from '../images'

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
  }
  componentWillReceiveProps(nextProps) {
    const id = this.props.match.params.id
    const nextId = nextProps.match.params.id
    if(id !== nextId) {
      const image = imageMap[nextId]
      const p = Math.min(window.innerWidth/image.width, window.innerHeight/image.height, 1)
      this.setState({
        image,
        uri: null,
        width: image.width * p,
        height: image.height * p
      })
      setTimeout(() => this.setState({ uri: image.uri }), 100)
    }
  }
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id
    const image = imageMap[id]
    const p = Math.min(window.innerWidth/image.width, window.innerHeight/image.height, 1)
    this.setState({
      image,
      uri: image.uri,
      width: image.width * p,
      height: image.height * p
    })
  }

  render() {
    const { uri, width, height, image } = this.state
    if(!image) return false
    return (
      <div style={style.component}>
        <img width={width} height={height} src={uri} />
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
