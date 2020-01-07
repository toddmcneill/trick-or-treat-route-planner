const { newClientStub, newClient, dropAll } = require('../api/dgraph')

const dgraphClientStub = newClientStub()
const dgraphClient = newClient(dgraphClientStub)

dropAll(dgraphClient)
  .then(() => {
    console.log('Dropped All')
  })
  .catch(e => {
    console.log(e)
  })
