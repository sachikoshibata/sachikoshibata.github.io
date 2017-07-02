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
  render() {
    const id = this.props.match.params.id
    const image = imageMap[id]
    if(!image) return false
    return (
      <div style={{
        ...style.component,
        backgroundImage: `url(${image.uri})`
      }}>
        <div style={style.navi}>
          { image.prev && <Link style={style.naviItem} to={`/${image.prev.id}`}>←</Link> }
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
