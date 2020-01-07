const config = require('./config')
const dgraph = require('dgraph-js')
const grpc = require('grpc')

// Create a client stub.
function newClientStub() {
  return new dgraph.DgraphClientStub(
    `${config.DB_HOST}:${config.DB_PORT}`,
    grpc.credentials.createInsecure(),
    { 'grpc.max_receive_message_length': 1024 * 1024 * 1024 }
  )
}

// Create a client.
function newClient(clientStub) {
  return new dgraph.DgraphClient(clientStub)
}

// Drop All - discard all data and start from a clean slate.
async function dropAll(dgraphClient) {
  const op = new dgraph.Operation()
  op.setDropAll(true)
  return dgraphClient.alter(op)
}

// Set schema.
async function setSchema(dgraphClient, schema) {
  const op = new dgraph.Operation()
  op.setSchema(schema)
  return dgraphClient.alter(op)
}

// Create data using JSON.
async function writeJson(dgraphClient, jsonQuery) {
  // Create a new transaction.
  const txn = dgraphClient.newTxn()
  try {
    // Run mutation.
    const mu = new dgraph.Mutation()
    mu.setSetJson(jsonQuery)
    const response = await txn.mutate(mu)

    // Commit transaction.
    await txn.commit()

    return response.toObject()
  } finally {
    // Clean up. Calling this after txn.commit() is a no-op and hence safe.
    await txn.discard()
  }
}

async function writeRdf(dgraphClient, nquads) {
  const txn = dgraphClient.newTxn()
  try {
    const mu = new dgraph.Mutation()
    mu.setSetNquads(nquads.join('\n'))
    const response = await txn.mutate(mu)

    await txn.commit()

    return response.toObject()
  } finally {
    await txn.discard()
  }
}

// Query for data.
async function query(dgraphClient, query) {
  const res = await dgraphClient.newTxn().query(query)
  return res.getJson()
}

module.exports = {
  newClientStub,
  newClient,
  dropAll,
  setSchema,
  writeJson,
  writeRdf,
  query,
}
