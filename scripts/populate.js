const { newClientStub, newClient, setSchema, writeRdf } = require('../api/dgraph')
const faker = require('faker')

async function populate() {
  const dgraphClientStub = newClientStub()
  const dgraphClient = newClient(dgraphClientStub)

  const mutations = generateMutations()
  const result = await writeRdf(dgraphClient, mutations)

  const schema = getSchema()
  await setSchema(dgraphClient, schema)

  dgraphClientStub.close()

  return result
}

function getSchema() {
  return `
    type Child {
      name
      lives_at
      candy_preference
      candy_capacity
      hit_points
    }

    type Candy {
      name
      mass
      is_poisoned
    }
    
    type House {
      name
      x
      y
      distributes
      neighbor_of
    }
  
    name: string .
    lives_at: [uid] @reverse .
    candy_preference: [uid] .
    candy_capacity: int .
    hit_points: int .
    mass: int .
    is_poisoned: bool .
    x: int .
    y: int .
    has_candy: [uid] .
    neighbor_of: [uid] @reverse .
  `
}

function generateMutations() {
  const candies = generateCandies()
  const houses = generateHouses(candies)
  const children = generateChildren(candies, houses)
  const mutations = []

  for (let i = 0; i < candies.length; i++) {
    const candy = candies[i]
    mutations.push(`_:${candy.blankId} <dgraph.type> "Candy" .`)
    mutations.push(`_:${candy.blankId} <name> "${candy.name}" .`)
    mutations.push(`_:${candy.blankId} <mass> "${candy.mass}" .`)
    mutations.push(`_:${candy.blankId} <is_poisoned> "${candy.isPoisoned}" .`)
  }

  for (let i = 0; i < houses.length; i++) {
    const house = houses[i]
    mutations.push(`_:${house.blankId} <dgraph.type> "House" .`)
    mutations.push(`_:${house.blankId} <name> "${house.name}'s House" .`)
    mutations.push(`_:${house.blankId} <x> "${house.x}" .`)
    mutations.push(`_:${house.blankId} <y> "${house.y}" .`)
    mutations.push(`_:${house.blankId} <distributes> _:${house.distributes} .`)

    for (let i = 0; i < house.neighbors.length; i++) {
      const neighbor = house.neighbors[i]
      mutations.push(`_:${house.blankId} <neighbor_of> _:${neighbor.neighborId} (time_between=${neighbor.timeBetween}) .`)
    }
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    mutations.push(`_:${child.blankId} <dgraph.type> "Child" .`)
    mutations.push(`_:${child.blankId} <name> "${child.name}" .`)
    mutations.push(`_:${child.blankId} <lives_at> _:${child.livesAt} .`)
    mutations.push(`_:${child.blankId} <candy_capacity> "${child.candyCapacity}" .`)
    mutations.push(`_:${child.blankId} <candy_preference> _:${child.candyPreference} .`)
    mutations.push(`_:${child.blankId} <hit_points> "${child.hitPoints}" .`)
  }

  return mutations
}

function generateCandies() {
  const names = [
    'abba-zabba',
    'airheads',
    'chick-o-stick',
    'kit kat',
    'mary janes',
    'mike and ike',
    'reeses',
    'sour patch kids',
    'snickers',
    'swedish fish',
    'warheads'
  ]
  const candy = []
  names.forEach((name, i) => {
    candy.push({
      blankId: `candy_${i}`,
      name,
      mass: Math.ceil(Math.random() * 10),
      isPoisoned: Math.random() < 0.15
    })
  })
  return candy
}

function generateHouses(candy) {
  const count = Math.ceil((Math.random() * 10) + 40)
  const gridSizeX = Math.ceil((Math.random() * 10) + 20)
  const gridSizeY = Math.ceil((Math.random() * 10) + 20)
  const houses = []
  for (let i = 0; i < count; i++) {
    let x
    let y
    let attempt = 0
    do {
      x = Math.floor(Math.random() * gridSizeX)
      y = Math.floor(Math.random() * gridSizeY)
    } while (houses.find(house => house.x === x && house.y === y))
    houses.push({
      blankId: `house_${i}`,
      name: faker.name.lastName(),
      x,
      y,
      distributes: candy[Math.floor(Math.random() * candy.length)].blankId,
      neighbors: []
    })
  }

  for (let i = 0; i < houses.length; i++) {
    const house = houses[i]
    for (let j = 0; j < houses.length; j++) {
      const neighbor = houses[j]
      if (house === neighbor) {
        continue
      }

      const timeBetween = Math.abs(house.x - neighbor.x) + Math.abs(house.y - neighbor.y)

      house.neighbors.push({
        neighborId: neighbor.blankId,
        timeBetween
      })
    }
  }

  return houses
}

function generateChildren(candy, houses) {
  const count = Math.ceil((Math.random() * 30) + 5)

  const children = []
  for (let i = 0; i < count; i++) {
    const house = houses[Math.floor(Math.random() * houses.length)]
    const name = `${faker.name.firstName()} ${house.name}`

    children.push({
      blankId: `child_${i}`,
      name,
      livesAt: house.blankId,
      candyCapacity: Math.ceil((Math.random() * 20) + 30),
      candyPreference: candy[Math.floor(Math.random() * candy.length)].blankId,
      hitPoints: Math.ceil((Math.random() * 5) + 5),
    })
  }

  return children
}

module.exports = {
  populate,
  generateCandies,
  generateHouses,
  generateChildren
}
