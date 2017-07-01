import React, { Component } from 'react'

export default class Image extends Component {
  constructor(props) {
    super(props)
    this.state = {
      on:false
    }
    this.update = this.update.bind(this)
  }
  componentWillUnmount() {
    this._mounted = false
  }
  componentDidMount() {
    this._mounted = true
    this.update()
  }
  componentWillReceiveProps(nextProps, nextState) {
    this.update(nextProps, nextState)
  }
  update(nextProps, nextState) {
    if(!nextProps) nextProps = this.props
    const { on } = this.state
    const that = this
    if(on) return
    const visible = nextProps.top + nextProps.height > nextProps.scrollTop &&
      nextProps.top < nextProps.scrollTop + nextProps.windowHeight
    setTimeout(_ => {
      if(!that._mounted) return
      that.setState({
        on:visible
      })
    }, 500)
  }
  shouldComponentUpdate(nextProps, nextState) {
    const currentState = this.state
    return false
      || nextState.on !== currentState.on
  }
  render() {
    const { src, alt } = this.props
    const { on } = this.state
    return (
      <img alt={alt} src={on ? src : undefined} />
    )
  }
}
