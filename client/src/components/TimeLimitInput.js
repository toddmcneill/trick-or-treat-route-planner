import React from 'react'

export const TimeLimitInput = ({ setTimeLimit }) => (
  <input placeholder='time Limit' onChange={(e) => setTimeLimit(e.target.value)} />
)