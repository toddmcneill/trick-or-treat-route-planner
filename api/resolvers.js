const dgraph = require('./dgraph')
const dgraphClientStub = dgraph.newClientStub()
const dgraphClient = dgraph.newClient(dgraphClientStub)

function getRoute() {
  return {
    child: {},
    route: []
  }
}

async function getAllHouses() {
  const query = `
  {
    houses(func: type(House)) {
      x
      y
      distributes {
        name
        mass
       }
      neighbor_of {
        x
        y
        distributes {
          name
          mass
        }
        name  
      }
      name
    }
  }
  `

  const result = await dgraph.query(dgraphClient, query)
  console.log(result.houses)
  return result.houses.map(house => ({
    x: house.x,
    y: house.y,
    candy: house.distributes[0],
    neighbors: house.neighbor_of.map(neighbor => ({
      x: neighbor.x,
      y: neighbor.y,
      candy: neighbor.distributes[0],
      name: neighbor.name
    })),
    name: house.name
  }))

}

function getAllChildren() {
  return []
}

function getAllCandy() {
  return []
}

module.exports = {
  Query: {
    route: getRoute,
    houses: getAllHouses,
    children: getAllChildren,
    candy: getAllCandy
  }
}
