const { generateCandies, generateHouses, generateChildren } = require('./populate')
const assert = require('assert')

describe('populate', () => {
  context('generateCandies', () => {
    it('generates candy', () => {
      const candy = generateCandies()
      assert(Array.isArray(candy))
      assert(candy.length)
    })
  })

  context('generateHouses', () => {
    it('generates houses', () => {
      const candy = generateCandies()
      const houses = generateHouses(candy)
      assert(Array.isArray(houses))
      assert(houses.length)
    })

    it('assigns neighbors', () => {
      const candy = generateCandies()
      const houses = generateHouses(candy)
      houses.forEach(house => {
        assert(house.neighbors.length)
        house.neighbors.forEach(neighbor => {
          assert(neighbor.neighborId)
          assert(neighbor.timeBetween > 0)
        })
      })
    })
  })

  context('generateChildren', () => {
    it('generates children', () => {
      const candy = generateCandies()
      const houses = generateHouses(candy)
      const children = generateChildren(candy, houses)
      assert(Array.isArray(children))
      assert(children.length)
    })
  })
})
