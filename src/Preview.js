import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Image from './PreviewImage'
import { findDOMNode } from 'react-dom'
import styled from 'styled-components'
import throttle from 'lodash/throttle'

const HEIGHT = 240
const MARGIN = 5

const Row = styled.div.attrs({
  style: props => ({
    height: props.height
  })
})`
  position: relative;
  margin-bottom: ${MARGIN}px;
`
const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-sizing: border-box;
  overflow: hidden;
`

export default class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: []
    }
    this.onResize = throttle(this.onResize.bind(this), 250, { leading: false })
    this.onScroll = this.onScroll.bind(this)
  }
  onResize() {
    const { images } = this.props
    const width = window.innerWidth
    const rows = []
    let left = 0, top = 0, currentRow = []
    for(let image of images) {
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
    }
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
    const offsetTop = findDOMNode(this).offsetTop
    this.setState({
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
      offsetTop
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
      <div style={{ width, height }}>
        { rows && rows.map((row, i) => 
          <Row key={i} height={row.height}>
            { row.map((image, j) =>
              <ImageContainer
                key={j}
                style={{
                  left: row.height * image.left,
                  width: row.height * image.width/image.height,
                  height: row.height,
                  backgroundColor:image.color,
                }}
              >
                { (offsetTop + row.top < scrollTop + windowHeight &&
                  scrollTop < offsetTop + row.top + row.height) &&
                    <Image to={`/${image.id}`} src={image.thumbnail} alt={image.info.title} />
                }
              </ImageContainer>
            )}
          </Row>
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
