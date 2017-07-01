const loaderUtils = require('loader-utils')
const sizeOf = require('image-size')
const promisify = require('es6-promisify')
const gm = require('gm')

const im = gm.subClass({imageMagick: true})

const DEFAULTOPTIONS = {
  name: '[hash].[ext]'
}

const getColor = path => new Promise((resolve, reject) => {
  im(path).setFormat('ppm').resize(1, 1).toBuffer((err, buffer) => {
    if(err) return reject(err)
    const color = 'rgb(' + buffer.readUInt8(buffer.length - 3)
      + ',' + buffer.readUInt8(buffer.length - 2)
      + ',' + buffer.readUInt8(buffer.length - 1) + ')'
    resolve(color)
  })
})
const getSize = async path => {
  const size = await promisify(sizeOf)(path)
  return size
}

module.exports = function(content) {
  (async () => {

    const callback = this.async()
    const options = { ...DEFAULTOPTIONS, ...loaderUtils.getOptions(this) }
    const filename = loaderUtils.interpolateName(this, options.name, { content })

    this.emitFile(filename, content)

    const size = await getSize(this.resourcePath)
    const color = await getColor(this.resourcePath)

    callback(null, [
      'module.exports = {',
      'bytesTotal:' + content.length + ',',
      'width:' + size.width + ',',
      'height:' + size.height + ',',
      'color:' + JSON.stringify(color) + ',',
      'uri:' + '__webpack_public_path__ + ' + JSON.stringify(filename),
      '}'
    ].join(''))

  })()
}

module.exports.raw = true
