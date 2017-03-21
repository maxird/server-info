'use strict'

const restify = require('restify')
const os = require('os')

const server = restify.createServer({})

const networks = () => {
  const info = os.networkInterfaces()
  let list = []
  Object.keys(info).forEach(name => {
    const o = info[name]
    o.forEach(i => {
      if (i.family === 'IPv4')
        list.push(`${name}/${i.address}`)
    })
  })
  return list
}

server.get('/', (req, res, next) => {
  res.json({
    name: os.hostname(),
    net: networks()
  })
  return next()
})

server.listen(process.env.PORT || 8774, '0.0.0.0', (err) => {
  console.log(`listening on ${server.name} at ${server.url}`)
})
