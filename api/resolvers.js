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
      name
      x
      y
      distributes {
        name
        mass
       }
      neighbor_of {
        name  
        x
        y
        distributes {
          name
          mass
        }
      }
    }
  }
  `

  const result = await dgraph.query(dgraphClient, query)
  return result.houses.map(mapHouse)
}

function mapHouse(house) {
  return {
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
  }
}

async function getAllChildren() {
  const query = `
  {
    children(func: type(Child)) {
      name
      lives_at {
        name
        x
        y
        distributes {
          name
          mass
        }
        neighbor_of {
          name  
          x
          y
          distributes {
            name
            mass
          }
        }
      }
      candy_preference {
        name
        mass
      }
      candy_capacity
      hit_points
    }
  }
  `

  const result = await dgraph.query(dgraphClient, query)
  return result.children.map(mapChild)
}

function mapChild(child) {
  return {
    name: child.name,
    home: mapHouse(child.lives_at[0]),
    candy_preference: child.candy_preference[0],
    candy_capacity: child.candy_capacity,
    is_alive: true
  }
}

async function getAllCandy() {
  const query = `
  {
    candy(func: type(Candy)) {
      name
      mass
    }
  }
  `
  const result = await dgraph.query(dgraphClient, query)
  return result.candy
}

module.exports = {
  Query: {
    route: getRoute,
    houses: getAllHouses,
    children: getAllChildren,
    candy: getAllCandy
  }
}
