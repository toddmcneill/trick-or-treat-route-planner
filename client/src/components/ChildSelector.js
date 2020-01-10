import React from 'react'

export const ChildSelector = ({loading, error, data, setSelectedChild}) => {
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return (
    <select onChange={(e) => setSelectedChild(e.target.value)}>
      <option></option>
      {data.children.map((child, i) => <option value={child.uid} key={i}>{child.name}</option>)}
    </select>
  )
}