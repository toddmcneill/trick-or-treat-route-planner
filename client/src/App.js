import React from 'react';
import './App.css';
import { Neighborhood } from './components/Neighborhood'
import { ChildSelector } from './components/ChildSelector'
import { TimeLimitInput } from './components/TimeLimitInput'
import { TrickOrTreatButton } from './components/TrickOrTreatButton'
import { gql, useQuery } from '@apollo/client'

const HOUSES = gql`
  {
    houses {
      name
      x
      y 
    }
  }
`

function App() {
  const { loading: loadingHouses, error: errorHouses, data: dataHouses } = useQuery(HOUSES)

  return (
    <div className="App" style={{display: 'flex'}}>
      <div>
        <ChildSelector/>
        <TimeLimitInput/>
        <TrickOrTreatButton/>
      </div>
      <Neighborhood loading={loadingHouses} data={dataHouses} error={errorHouses}/>
    </div>
  )
}

export default App;
