function getRoute() {
  return {
    child: {},
    route: []
  }
}

function getAllHouses() {
  return []
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
