import React, { Component } from 'react'
import PropTypes from 'prop-types'
import scrollbarwidth from './scrollbarwidth'
import style from '../styles/Preview'
import Image from './Image'

const SIZE = 640
const MARGIN = 30

export default class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      scrollTop:document.body.scrollTop
    }
    this.updateLayout = this.updateLayout.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }
  updateLayout() {
    const { images } = this.props
    const width = window.innerWidth - scrollbarwidth()
    if(width === this.state.width) return
    let rows = []
    images.forEach((image, i) => {
      let row = rows[rows.length - 1]
      if(!row || row.done) {
        const top = rows.reduce((v, n) => {
          v += n.per + MARGIN / SIZE
          return v
        }, 0)
        row = {
          top: top + MARGIN / SIZE,
          images: [],
          width: MARGIN / SIZE,
          per: 1
        }
        rows.push(row)
      }
      row.images.push({
        left:row.width,
        index:i,
        image:image
      })
      row.width += image.width / image.height + MARGIN / SIZE
      if(row.width * SIZE > width) {
        row.per = width / (row.width * SIZE)
        row.done = true
      }
    })
    this.setState({
      width: width,
      height:window.innerHeight,
      rows:rows
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout)
  }
  onScroll() {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
    this.setState({ scrollTop })
  }
  componentDidMount() {
    document.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.updateLayout)
    this.updateLayout()
  }
  render() {
    const { height, scrollTop, rows } = this.state
    return (
      <div style={style.component} ref='container'>
        { rows && rows.map((row, r) => {
          return (
            <div key={r} className='row'>
              { row.images.map((image, i) => {
                return (
                  <div className='image' style={{
                    position:'absolute',
                    left:image.left * row.per * SIZE,
                    top:row.top * SIZE,
                    width:row.per * SIZE / image.image.height * image.image.width,
                    height:row.per * SIZE,
                    background:image.image.color,
                    marginBottom:MARGIN
                  }} key={i}>
                  <Image
                    alt=''
                    top={this.refs.container.offsetTop + row.top * SIZE}
                    windowHeight={height}
                    height={row.per * SIZE}
                    scrollTop={scrollTop}
                    src={image.image.url}
                  />
                </div>
                )
              })}
            </div>
          )
        })}
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
