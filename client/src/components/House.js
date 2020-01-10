import React from 'react'

import styles from './house.module.css'

export const House = ({house, routeIndex, scale}) => {
  const { name, x, y } = house

  let label = name
  if (routeIndex !== -1 && routeIndex !== null) {
    label += ` (${routeIndex})`
  }

  return (
    <div
      className={styles.house}
      style={{
        width: `${scale/2}px`,
        height: `${scale/2}px`,
        margin: `${scale/4}px`,
        top: `${scale*y}px`,
        left: `${scale*x}px`,
      }}>{label}</div>
  )
}