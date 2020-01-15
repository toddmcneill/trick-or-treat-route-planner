import React, { useEffect } from 'react'
import {House} from './House'
import styles from './neighborhood.module.css'

const animationSpeed = 80

function generateColor(offset) {
  // From offset of 0 = green to offset of 1 = red
  let ascendingHex = Number(Math.floor(offset * 255)).toString(16)
  if (ascendingHex.length < 2) {
    ascendingHex = '0' + ascendingHex
  }

  let descendingHex = Number(255 - (Math.floor(offset * 255))).toString(16)
  if (descendingHex.length < 2) {
    descendingHex = '0' + descendingHex
  }

  return '#' + ascendingHex + descendingHex + '00'
}

export const Neighborhood = ({ houses, route, scale }) => {
  const width = (houses.reduce((acc, cur) => cur.x > acc ? cur.x : acc, 0) + 1) * scale
  const height = (houses.reduce((acc, cur) => cur.y > acc ? cur.y : acc, 0) + 1) * scale

  const routeLength = route ? route.route.route.length : 0

  const houseRefs = {}
  const houseComponents = houses.map(house => {
    const houseRef = React.createRef()

    let routeIndex = null
    if (route) {
      routeIndex = route.route.route.findIndex(routeHouse => routeHouse.uid === house.uid)
    }

    let color = '#FFFFFF'
    if (routeIndex !== null && routeIndex !== -1) {
      houseRefs[routeIndex] = houseRef
      color = generateColor(routeIndex / routeLength)
    }

    return <House house={house} color={color} scale={scale} ref={houseRef} key={house.uid} />
  })


  useEffect(() => {
    for (let routeIndex in houseRefs) {
      const houseRef = houseRefs[routeIndex]

      const animationLength = routeLength * animationSpeed
      const startOffset = routeIndex / routeLength
      const endOffset = startOffset + (animationSpeed / (routeLength * animationSpeed))

      const keyFrames = [
        {
          opacity: 0.5,
          fill: '#FFFFFF'
        },
        {
          opacity: 0.5,
          fill: '#FFFFFF',
          offset: startOffset
        },
        {
          opacity: 1,
          fill: generateColor(startOffset),
          offset: endOffset
        },
        {
          opacity: 1,
          fill: generateColor(startOffset)
        }
      ]

      houseRef.current.animate(keyFrames, animationLength)
    }
  }, [route])

  return (
    <div className={styles.neighborhoodWrapper}>
      <div className={styles.neighborhood} style={{ width: `${width}px`, height: `${height}px` }}>
        {houseComponents}
      </div>
    </div>
  )
}
