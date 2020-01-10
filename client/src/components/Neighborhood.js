import React from 'react'

import {House} from './House'

import styles from './neighborhood.module.css'

export const Neighborhood = ({loading, error, data, route, scale}) => {
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const width = (data.houses.reduce((acc, cur) => cur.x > acc ? cur.x : acc, 0) + 1) * scale
  const height = (data.houses.reduce((acc, cur) => cur.y > acc ? cur.y : acc, 0) + 1) * scale

  return (
    <div className={styles.neighborhood} style={{ width: `${width}px`, height: `${height}px` }}>
      {data.houses.map((house, i) => {
        let routeIndex = null
        if (route) {
          routeIndex = route.route.route.findIndex(routeHouse => routeHouse.uid === house.uid)
        }

        return <House house={house} routeIndex={routeIndex} scale={scale} key={i}/>
      })}
    </div>
  )
}
