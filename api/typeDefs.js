const { gql } = require('apollo-server')

module.exports = gql`
  type Candy {
    uid: String
    name: String
    mass: Int
  }
  
  type House {
    uid: String
    name: String
    x: Int
    y: Int
    candy: Candy
    neighbors: [House]
    time_to: Int
  }
  
  type Child {
    uid: String
    name: String
    home: House
    candy_preference: Candy
    candy_capacity: Int
    is_alive: Boolean
  }
  
  input RouteInput {
    childId: String
    timeLimit: Int
  }

  type RouteResponse {
    child: Child
    collectedCandy: [Candy]
    route: [House]
  }

  type Query {
    houses: [House]
    children: [Child]
    candy: [Candy]
    route(input: RouteInput): RouteResponse
  }
`
