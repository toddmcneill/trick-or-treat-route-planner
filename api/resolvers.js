const dgraph = require('./dgraph')
const dgraphClientStub = dgraph.newClientStub()
const dgraphClient = dgraph.newClient(dgraphClientStub)

const candyFragment = `
  uid
  name
  mass
  is_poisoned
`

const houseFragment = `
  uid
  name  
  x
  y
  distributes {
    ${candyFragment}
  }
`

const childFragment = `
  uid
  name
  lives_at {
    ${houseFragment}
    neighbor_of @facets(time_between: time_between) {
      ${houseFragment}
    }
  }
  candy_preference {
    ${candyFragment}
  }
  candy_capacity
  hit_points
`

async function getAllCandy() {
  const query = `
  {
    candy(func: type(Candy)) {
      ${candyFragment}
    }
  }
  `
  const result = await dgraph.query(dgraphClient, query)
  return result.candy.map(mapCandy)
}

function mapCandy(candy) {
  return {
    uid: candy.uid,
    name: candy.name,
    mass: candy.mass
  }
}

async function getAllHouses() {
  const query = `
  {
    houses(func: type(House)) {
      ${houseFragment}
      neighbor_of @facets(time_between: time_between)  {
        ${houseFragment}
      }
    }
  }
  `

  const result = await dgraph.query(dgraphClient, query)
  return result.houses.map(mapHouse)
}

function mapHouse(house) {
  return {
    uid: house.uid,
    name: house.name,
    x: house.x,
    y: house.y,
    candy: mapCandy(house.distributes[0]),
    neighbors: house.neighbor_of.map(neighbor => ({
      name: neighbor.name,
      x: neighbor.x,
      y: neighbor.y,
      candy: mapCandy(neighbor.distributes[0]),
      time_to: neighbor.time_between
    })),
    time_to: 0
  }
}

async function getAllChildren() {
  const query = `
  {
    children(func: type(Child)) {
      ${childFragment}
    }
  }
  `

  const result = await dgraph.query(dgraphClient, query)
  return result.children.map(mapChild)
}

function mapChild(child) {
  return {
    uid: child.uid,
    name: child.name,
    home: mapHouse(child.lives_at[0]),
    candy_preference: mapCandy(child.candy_preference[0]),
    candy_capacity: child.candy_capacity,
    is_alive: true
  }
}

async function getRoute(parent, args) {
  const { childId, timeLimit } = args.input

  const childQuery = `
  {
    child(func: uid(${childId})) {
      ${childFragment}
    }
  }
  `

  const child = (await dgraph.query(dgraphClient, childQuery)).child[0]

  const houseQuery = `
  {
    houses(func: type(House)) {
      ${houseFragment}
      neighbor_of @facets(time_between: time_between) {
        ${houseFragment}
      }
    }
  }
  `

  const houses = (await dgraph.query(dgraphClient, houseQuery)).houses

  const collectedCandy = []
  const route = []
  let timeLeft = timeLimit
  let candyCapacity = child.candy_capacity
  const preferredCandyTimeReduction = 0.5

  // Start at the child's home.
  let currentHouse = child.lives_at[0]
  route.push(currentHouse)

  function getAdjustedTimeBetween(house) {
    if (house.distributes[0].uid === child.candy_preference[0].uid) {
      return house.time_between * preferredCandyTimeReduction
    }
    return house.time_between
  }

  while (timeLeft > 0 && candyCapacity > 0) {
    // Find the closest house, reducing the effective time if it's the child's favorite candy.
    const filteredHouses = currentHouse.neighbor_of.filter(house => !route.find(routeHouse => house.uid === routeHouse.uid))
    if (!filteredHouses.length) {
      break
    }
    const nextNeighbor = filteredHouses.reduce((acc, cur) => {
      if (acc === null) {
        return cur
      }

      const curAdjustedTime = getAdjustedTimeBetween(cur)
      const accAdjustedTime = getAdjustedTimeBetween(acc)

      if (curAdjustedTime < accAdjustedTime) {
        return cur
      }
      return acc
    }, null)

    // Travel to that house.
    const nextHouse = houses.find(house => house.uid === nextNeighbor.uid)
    route.push(nextHouse)
    currentHouse = nextHouse

    // Add candy to the collected candy.
    collectedCandy.push(currentHouse.distributes[0])
  }

  const mappedChild = mapChild(child)

  // Calculate poison damage and child living status.
  let poisonDamage = 0
  collectedCandy.forEach(candy => {
    if (candy.is_poisoned) {
      poisonDamage += candy.mass
    }
  })

  if (poisonDamage >= child.hit_points) {
    mappedChild.is_alive = false
  }

  return {
    child: mappedChild,
    collectedCandy: collectedCandy,
    route: route.map(mapHouse)
  }
}

module.exports = {
  Query: {
    candy: getAllCandy,
    houses: getAllHouses,
    children: getAllChildren,
    route: getRoute
  }
}
