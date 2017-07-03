import loaderUtils from 'loader-utils'
import sizeOf from 'image-size'
import promisify from 'es6-promisify'
import gm from 'gm'
import exif from 'exiftool'
import fs from 'fs'

const im = gm.subClass({imageMagick: true})

const DEFAULTOPTIONS = { name: '[hash].[ext]',
  thumbnail: '[hash]_thumbnail.[ext]',
  thumbnailSize: 120
}

const getThumbnail = (path, size) => new Promise((resolve, reject) => {
  im(path).resize(null, size).toBuffer((err, buffer) => {
    err ?  reject(err) : resolve(buffer)
  })
})

const getColor = path => new Promise((resolve, reject) => {
  im(path).setFormat('ppm').resize(1, 1).toBuffer((err, buffer) => {
    if(err) return reject(err)
    const color = 'rgb(' + buffer.readUInt8(buffer.length - 3)
      + ',' + buffer.readUInt8(buffer.length - 2)
      + ',' + buffer.readUInt8(buffer.length - 1) + ')'
    resolve(color)
  })
})

const getInfo = async (content, keys) => {
  const info = await promisify(exif.metadata)(content)
  console.log(info)
  return keys.reduce((v, key) => {
    if(Array.isArray(key)) {
      v[key[0]] = key[1](info)
    } else if(info[key]) {
      v[key] = info[key]
    }
    return v
  }, {})
}

const getSize = async path => {
  const size = await promisify(sizeOf)(path)
  return size
}

module.exports = function(content) {
  (async () => {

    const callback = this.async()
    const options = { ...DEFAULTOPTIONS, ...loaderUtils.getOptions(this) }
    const filename = loaderUtils.interpolateName(this, options.name, { content })
    const hash = loaderUtils.getHashDigest(content, 'md5', 'hex')

    this.emitFile(filename, content)

    const size = await getSize(this.resourcePath)
    const color = await getColor(this.resourcePath)
    const info = await getInfo(content, options.exifKeys)

    // thumbnail
    const thumbnail = await getThumbnail(this.resourcePath, options.thumbnailSize)
    const filename_thumbnail = loaderUtils.interpolateName(this, options.thumbnail, { content })
    this.emitFile(filename_thumbnail, thumbnail)

    callback(null, [
      'module.exports = {',
      'id:' + JSON.stringify(hash) + ',',
      'bytesTotal:' + content.length + ',',
      'width:' + size.width + ',',
      'height:' + size.height + ',',
      'color:' + JSON.stringify(color) + ',',
      'uri:' + '__webpack_public_path__ + ' + JSON.stringify(filename) + ',',
      'thumbnail:' + '__webpack_public_path__ + ' + JSON.stringify(filename_thumbnail) + ',',
      'info:' + JSON.stringify(info) + ',', 
      '}'
    ].join(''))

  })()
}

module.exports.raw = true
