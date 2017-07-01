import React, { Component } from 'react'
import images from '../images'
import scrollbarwidth from './scrollbarwidth'
import Image from './Image'

console.log(images)

const SIZE = 640
const MARGIN = 30

export default class App extends Component {
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
    const that = this
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
    that.setState({
      width: width,
      height:window.innerHeight,
      rows:rows
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout)
  }
  onScroll() {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || 
      document.body.scrollTop
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
      <div className='App'>
        <div className='header'>
          <h2>柴田幸子</h2>
          <h3>Sachiko Shibata</h3>
          <p>
            1947年奈良生まれ<br/>
            兵庫県川西市在住<br/>
            <br/>
            メールはこちら: <a href='mailto:sachiko@yansu.jp'>sachiko@yansu.jp</a><br/>
            &copy;2016 Sachiko Shibata all rights reserved.<br/>
          </p>
        </div>
        <div ref='container'>
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
      </div>
    )
  }
}
