const images = [
  require('./10198567745.jpg'),
  require('./10198706146.jpg'),
  require('./10198765873.jpg'),
  require('./10198766813.jpg'),
  require('./9870726845.jpg'),
  require('./9870727795.jpg'),
  require('./9870728475.jpg'),
  require('./9870728845.jpg'),
  require('./9870728955.jpg'),
  require('./9870729775.jpg'),
  require('./9870730364.jpg'),
  require('./9870730925.jpg'),
  require('./9870732544.jpg'),
  require('./9870732994.jpg'),
  require('./9870733174.jpg'),
  require('./9870734404.jpg'),
  require('./9870734654.jpg'),
  require('./9870734714.jpg'),
  require('./9870735245.jpg'),
  require('./9870735424.jpg'),
  require('./9870735984.jpg'),
  require('./9870736284.jpg'),
  require('./9870737034.jpg'),
  require('./9870737356.jpg'),
  require('./9870737975.jpg'),
  require('./9870738135.jpg'),
  require('./9870738386.jpg'),
  require('./9870738525.jpg'),
  require('./9870739014.jpg'),
  require('./9870739034.jpg'),
  require('./9870739664.jpg'),
  require('./9870739984.jpg'),
  require('./9870740554.jpg'),
  require('./9870740664.jpg'),
  require('./9870741034.jpg'),
  require('./9870741704.jpg'),
  require('./9870742304.jpg'),
  require('./9870742324.jpg'),
  require('./9870742424.jpg'),
  require('./9870744326.jpg'),
  require('./9870745256.jpg'),
  require('./9870746466.jpg'),
  require('./9870746906.jpg'),
  require('./9870749496.jpg'),
  require('./9870750086.jpg'),
  require('./9870841223.jpg'),
  require('./9870841303.jpg'),
  require('./9870842013.jpg'),
  require('./9870843013.jpg'),
  require('./9870845093.jpg'),
  require('./9870845553.jpg'),
  require('./9870845793.jpg'),
  require('./9870848643.jpg'),
  require('./9870848803.jpg'),
  require('./9870849903.jpg'),
  require('./9870850113.jpg'),
  require('./P1080585.jpg'),
  require('./P1080586.jpg'),
  require('./P1080590.jpg'),
  require('./P1080595.jpg'),
  require('./P1080598.jpg'),
  require('./P1080601.jpg'),
  require('./P1080607.jpg'),
  require('./P1080608.jpg'),
  require('./P1080612.jpg'),
  require('./P1080615.jpg'),
  require('./P1080619.jpg'),
  require('./P1080622.jpg'),
  require('./P1080623.jpg'),
  require('./P1080624.jpg'),
  require('./P1080625.jpg'),
  require('./P1080626.jpg'),
  require('./P1080627.jpg'),
  require('./P1080628.jpg'),
  require('./P1080629.jpg'),
  require('./P1080630.jpg'),
  require('./P1080631.jpg'),
  require('./P1080632.jpg'),
  require('./P1080633.jpg'),
  require('./P1080634.jpg'),
  require('./P1080635.jpg'),
  require('./P1080636.jpg'),
  require('./P1080639.jpg'),
  require('./josei.jpg'),
]

const clusters = [
  {
    name: '油彩',
    description: 'メインの油彩です',
    images: images.filter(image => image.info.keyword.indexOf('oil') >= 0)
  },
  {
    id: 'water',
    name: '水彩',
    description: '水彩も描いています',
    images: images.filter(image => image.info.keyword.indexOf('water') >= 0)
  },
  {
    id: 'old',
    name: '昔に描いたものです',
    images: images.filter(image => image.info.keyword.indexOf('old') >= 0)
  }
]

export default clusters
export const imageMap = {}
export const imageList = []

let prev, index = 0
for(let cluster of clusters) {
  for(let image of cluster.images) {
    if(prev) {
      image.prev = prev
      prev.next = image
    }
    image.index = index++
    imageMap[image.id] = image
    imageList.push(image)
    prev = image
  }
}

