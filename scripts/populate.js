const { newClientStub, newClient, setSchema, writeRdf } = require('../api/dgraph')

async function populate() {
  const dgraphClientStub = newClientStub()
  const dgraphClient = newClient(dgraphClientStub)

  const mutations = generateMutations()
  const result = await writeRdf(dgraphClient, mutations)

  // const schema = getSchema()
  // await setSchema(dgraphClient, schema)

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
      is_alive
    }
    
    type House {
      name
      x
      y
      has_candy
      neighbor_of
    }
  
    name: string .
    lives_at: [uid] .
    candy_preference: [uid] .
    candy_capacity: [uid] .
    hit_points: int .
    mass: int .
    is_alive: boolean .
    x: int .
    y: int .
    has_candy: [uid] .
    neighbor_of: [uid] @reverse .
  `
}

function generateMutations() {
  const childName = 'Jake'
  const houseName = `Jake's House`
  return [
    `_:child <lives_at> _:house .`,
    `_:child <name> "${childName}" .`,
    `_:house <name> "${houseName}" .`,
  ]
}

// function generateOneRow(taxonomyRow, uuid) {
//   const snakeCasedRow = taxonomyRow.map(tag => snakeCase(tag))
//   const [superDomain, domain, subDomain, atomic] = snakeCasedRow
//
//   return [
//     `_:${superDomain} <dgraph.type> "Tag" .`,
//     `_:${superDomain} <label> "${superDomain}" .`,
//
//     `_:${domain} <dgraph.type> "Tag" .`,
//     `_:${domain} <label> "${domain}" .`,
//
//     `_:${subDomain} <dgraph.type> "Tag" .`,
//     `_:${subDomain} <label> "${subDomain}" .`,
//
//     `_:${atomic} <dgraph.type> "Tag" .`,
//     `_:${atomic} <label> "${atomic}" .`,
//
//     `_:${uuid} <dgraph.type> "Taxonomy" .`,
//     `_:${uuid} <xid> "${uuid}" .`,
//     `_:${uuid} <label> "${superDomain} | ${domain} | ${subDomain} | ${atomic}" .`,
//     `_:${uuid} <super_domain> _:${superDomain} .`,
//     `_:${uuid} <domain> _:${domain} .`,
//     `_:${uuid} <sub_domain> _:${subDomain} .`,
//     `_:${uuid} <atomic> _:${atomic} .`,
//   ]
// }

module.exports = {
  populate
}
