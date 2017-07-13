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
  const now = (new Date()).toISOString()
  const data = {
    ts: `${now}`,
    name: os.hostname(),
    net: networks(),
    headers: req.headers
  }
  const body = JSON.stringify(data, null, 2) + '\n'

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  })

  res.write(body)
  res.end()
  return next()
})

server.listen(process.env.PORT || 8774, '0.0.0.0', (err) => {
  console.log(`listening on ${server.name} at ${server.url}`)
})
