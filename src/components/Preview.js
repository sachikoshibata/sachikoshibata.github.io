import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from '../styles/Preview'
import Image from './PreviewImage'

const HEIGHT = 240
const MARGIN = 5

export default class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: []
    }
    this.onResize = this.onResize.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }
  onResize() {
    const { images } = this.props
    const width = window.innerWidth
    const rows = []
    let left = 0, top = 0, currentRow = []
    images.forEach(image => {
      currentRow.push({ ...image, left })
      left += image.width/image.height
      if(left > width/HEIGHT) {
        const p = Math.min((width/HEIGHT - MARGIN/HEIGHT*(currentRow.length-1)) / left, 1)
        currentRow.height = HEIGHT * p
        currentRow.top = top
        top += currentRow.height + MARGIN
        left = 0
        currentRow.forEach((row, i) => row.left += i * MARGIN/p/HEIGHT)
        rows.push(currentRow)
        currentRow = []
      }
    })
    if(currentRow.length > 0) {
      const p = Math.min((width/HEIGHT - MARGIN/HEIGHT*(currentRow.length-1)) / left, 1)
      currentRow.height = HEIGHT * p
      currentRow.top = top
      top += currentRow.height + MARGIN
      currentRow.forEach((row, i) => row.left += i * MARGIN/p/HEIGHT)
      rows.push(currentRow)
    }
    this.setState({
      windowHeight: window.innerHeight,
      height: top - MARGIN,
      rows:rows
    })
  }
  onScroll() {
    this.setState({
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
      offsetTop: this.refs.component.offsetTop
    })
  }
  componentDidMount() {
    this.onResize()
    this.onScroll()
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
  }
  render() {
    const { windowHeight, scrollTop, offsetTop, rows, height } = this.state
    const { width } = this.props
    return (
      <div ref='component' style={{ ...style.component, width: width, height: height }}>
        { rows && rows.map((row, i) => 
          <div key={i} style={{ ...style.row, height: row.height, marginBottom: MARGIN }}>
            { row.map((image, j) =>
              <div
                key={j}
                style={{
                  ...style.imgContainer,
                  left: row.height * image.left,
                  width: row.height * image.width/image.height,
                  height: row.height,
                  backgroundColor:image.color,
                }}
              >
                { (offsetTop + row.top < scrollTop + windowHeight &&
                  scrollTop < offsetTop + row.top + row.height) &&
                    <Image to={`/${image.id}`} style={style.img} src={image.thumbnail} alt={image.info.title} />
                }
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}
Preview.propTypes = {
  images: PropTypes.array
}
Preview.defaultProps = {
  images: []
}
