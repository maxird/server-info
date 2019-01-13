// @ts-check
//
const restify = require('restify')
const os = require('os')

const NAME = process.env.NAME || 'unnamed'
const server = restify.createServer({
  name: NAME,
  // as a demo, let's format responses
  //
  formatters: {
    'application/json': (req, res, body) => {
      return JSON.stringify(body, null, 2)
    }
  }
})

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

function healthy() {
  return { healthy: true }
}

function ready() {
  const result = Object.assign({}, healthy(), { ready: false })

  // skip out if we are not healthy
  //
  if (!result.healthy)
    return result

  // now decide if we are ready
  //
  result.ready = true

  return result
}

server.get('/health', (req, res, next) => {
  const body = healthy()
  const status = body.healthy ? 200 : 503
  res.json(status, body)
  return next()
})

server.get('/ready', (req, res, next) => {
  const body = ready()
  const status = body.ready ? 200 : 503
  res.json(status, body)
  return next()
})

server.get('/', (req, res, next) => {
  const now = (new Date()).toISOString()
  const data = {
    ts: `${now}`,
    name: `${NAME}`,
    host: os.hostname(),
    net: networks(),
    headers: req.headers
  }

  res.json(200, data)
  return next()
})

server.listen(process.env.PORT || 80, '0.0.0.0', (err) => {
  console.log(`listening on ${server.name} at ${server.url}`)
})
