import React from 'react'

import {House} from './House'

export const Neighborhood = ({loading, error, data}) => {
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return (
    <div style={{ border: '1px solid black'}}>
      {data.houses.map((house, i) => <House name={house.name} key={i}/>)}
    </div>
  )
}
