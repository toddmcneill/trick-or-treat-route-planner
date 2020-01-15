import React from 'react'

export const ScaleSlider = ({ scale, setScale }) => {
  return <input type='range' min='1' max='100' value={scale} onChange={e => setScale(e.target.value)} />
}