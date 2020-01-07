const path = require('path')
const { populate } = require('./populate')

populate()
  .then(result => outputResult(result))
  .catch(e => console.log(e))

function outputResult(result) {
  console.log(`Parsing Time: ${Math.round(result.latency.parsingNs / 1000000)} ms`)
  console.log(`Processing Time: ${(result.latency.processingNs / 1000000000).toFixed(3)} s`)
  console.log(`Created ${result.uidsMap.length} nodes`)

  const minUid = result.uidsMap.reduce((acc, cur) => {
    return cur[1] < acc ? cur[1] : acc
  }, result.uidsMap[0][1])

  const maxUid = result.uidsMap.reduce((acc, cur) => {
    return cur[1] > acc ? cur[1] : acc
  }, result.uidsMap[0][1])

  console.log(`UIDs from ${minUid} to ${maxUid}`)
}
