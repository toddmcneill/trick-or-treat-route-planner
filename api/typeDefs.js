const { gql } = require('apollo-server')

module.exports = gql`
  type House {
    x: Int
    y: Int
    candy: Candy
    neighbors: [House]
    name: String
  }
  
  type Candy {
    name: String
    mass: Int
  }
  
  type Child {
    name: String
    home: House
    candy_preference: Candy
    candy_capacity: Int
    is_alive: Boolean
  }
  
  input RouteInput {
    childId: Int
    timeLimit: Int
  }

  type RouteResponse {
    child: Child
    route: [House]
  }

  type Query {
    route(input: RouteInput): RouteResponse
    houses: [House]
    children: [Child]
    candy: [Candy]
  }
`
