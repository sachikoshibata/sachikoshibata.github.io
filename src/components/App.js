import React, { Component } from 'react'
import images from '../images'
import style from '../styles/App'
import Preview from './Preview'

export default class App extends Component {
  render() {
    return (
      <div className='App'>
        <div style={style.header}>
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
        { images.map((image, i) => 
          <div key={i} style={style.image}>
            <div style={style.image_header}>
              { image.name && <h4>{image.name}</h4> }
              <p>{image.description}({ image.images.length})</p>
            </div>
            <Preview width={window.innerWidth} images={image.images} />
          </div>
        )}
      </div>
    )
  }
}
