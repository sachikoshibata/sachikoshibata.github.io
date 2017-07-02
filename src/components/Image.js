import React, { Component } from 'react'

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

export default class Image extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  async init() {
    const { src } = this.props
    await sleep(500)
    if(!this._mounted) return
    this.setState({ src })
  }
  componentDidMount() {
    this._mounted = true
    this.init()
  }
  componentWillUnmount() {
    this._mounted = false
  }
  render() {
    const { alt, style } = this.props
    const { src } = this.state
    if(!src) return false
    return <img src={src} alt={alt} style={style} />
  }
}
