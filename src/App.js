import React, { Component } from 'react'
import images from './images'
import Preview from './Preview'
import styled, { injectGlobal } from 'styled-components'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background:white;
    color:black;
  }
  * {
    letter-spacing: 0.01em;
    font-size: 15px;
  }
`
const Header = styled.div`
  padding: 90px 30px;
`
const ImageHeader = styled.div`
  padding: 30px;
`

export default class App extends Component {
  render() {
    const { children } = this.props
    return (
      <div>
        <Header>
          <h2>柴田幸子</h2>
          <h3>Sachiko Shibata</h3>
          <p>
            1947年奈良生まれ<br/>
            兵庫県川西市在住<br/>
            <br/>
            メールはこちら: <a href='mailto:sachiko@yansu.jp'>sachiko@yansu.jp</a><br/>
            &copy;2016 Sachiko Shibata all rights reserved.<br/>
          </p>
        </Header>
        { images.map((image, i) => 
          <div key={i}>
            <ImageHeader>
              { image.name && <h4>{image.name}</h4> }
              { image.description && <p>{image.description}</p> }
            </ImageHeader>
            <Preview images={image.images} />
          </div>
        )}
        { children }
      </div>
    )
  }
}
