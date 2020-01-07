const { ApolloServer } = require('apollo-server')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const config = require('./config')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError,
  formatResponse,
})

function formatError(err) {
  console.error(err)
  return err.message
}

function formatResponse(res) {
  console.info(res)
  return res
}

function start(port) {
  return server.listen({ port }).then(({ url }) => {
    console.log(`listening on ${url}`)
    return url
  })
}

function stop() {
  console.log('server stopping...')
  return server.stop().then(() => {
    console.log('server stopped')
  })
}

if (!config.SERVER_PORT) {
  console.error('env variables are missing, please see .template.env')
  process.exit(1)
}

process.on('SIGINT', () => {
  stop()
})
process.on('SIGTERM', () => {
  stop()
})

start(config.SERVER_PORT)
