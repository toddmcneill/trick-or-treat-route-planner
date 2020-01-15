import React from 'react'
import styles from './route-info.module.css'

export const RouteInfo = ({ loading, error, data }) => {
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  if (!data) return null

  const { child, collectedCandy, route } = data.route
  const accumulatedCandy = collectedCandy.reduce((acc, candy) => {
    const foundCandy = acc.find(accumulatedCandy => candy.uid === accumulatedCandy.uid)
    if (foundCandy) {
      foundCandy.count++
    }
    else {
      acc.push({...candy, count: 1})
    }
    return acc
  }, []).sort((a, b) => b.name < a.name ? 1 : -1)

  const candyMass = accumulatedCandy.reduce((acc, candy) => {
    return acc + (candy.mass * candy.count)
  }, 0)

  return (
    <div className={styles.routeInfo}>
      <div className={styles.header}>Child Name</div>
      <div>{child.name}</div>
      <div className={styles.header}>Candy Preference</div>
      <div>{child.candy_preference.name}</div>
      <div className={styles.header}>Candy Collected</div>
      <div>{accumulatedCandy.map(candy => <div key={candy.uid}> {candy.count}x {candy.name} </div>)}</div>
      <div className={styles.header}>Candy Mass</div>
      <div>{candyMass}</div>
      <div className={styles.header}>Is Alive</div>
      <div>{child.is_alive ? "Yes" : ":("}</div>
      <div className={styles.header}>Houses Visited</div>
      <ul className={styles.houseList}>
        {route.map((house, i) => <li key={house.uid}>{i}. {house.name} {house.candy}</li>)}
      </ul>
    </div>
  )
}