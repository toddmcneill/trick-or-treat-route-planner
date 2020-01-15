import React, { useState } from 'react'
import { HouseImage } from './HouseImage'
import styles from './house.module.css'

export const House = React.forwardRef(({ house, color, scale }, ref) => {
  const { name, x, y, candy } = house

  const [showLabel, setShowLabel] = useState(false)
  let label =  <div className={styles.label}>{name} ({candy.name})</div>

  return (
    <div
      className={styles.house}
      style={{
        width: `${scale/2}px`,
        height: `${scale/2}px`,
        margin: `${scale/4}px`,
        top: `${scale*y}px`,
        left: `${scale*x}px`,
      }}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      {showLabel && label}
      <HouseImage color={color} ref={ref} />
    </div>
  )
})
