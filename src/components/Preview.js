import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from '../styles/Preview'

const HEIGHT = 240
const MARGIN = 15

export default class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: []
    }
    this.updateLayout = this.updateLayout.bind(this)
  }
  updateLayout(width) {
    const { images } = this.props
    const rows = []
    let left = 0, top = 0, currentRow = []
    images.forEach(image => {
      currentRow.push({ ...image, left })
      left += image.width/image.height + MARGIN/HEIGHT
      if(left > width/HEIGHT) {
        left -= MARGIN/HEIGHT
        const p = Math.min((width/HEIGHT) / left, 1)
        currentRow.height = HEIGHT * p
        top += currentRow.height + MARGIN
        left = 0
        rows.push(currentRow)
        currentRow = []
      }
    })
    if(currentRow.length > 0) {
      const p = Math.min((width/HEIGHT) / left, 1)
      currentRow.height = HEIGHT * p
      top += currentRow.height + MARGIN
      rows.push(currentRow)
    }
    this.setState({
      height: top - MARGIN,
      rows:rows
    })
  }
  componentWillReceiveProps(nextProps) {
    const currentProps = this.props
    if(currentProps.width !== nextProps.width) {
      this.updateLayout(nextProps.width)
    }
  }
  componentDidMount() {
    const { width } = this.props
    this.updateLayout(width)
  }
  render() {
    const { rows, height } = this.state
    const { width } = this.props
    return (
      <div style={{ ...style.component, width: width, height: height }}>
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
                <img style={style.img} src={image.thumbnail} alt={image.info.title} />
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
