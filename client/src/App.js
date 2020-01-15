import React, { useState } from 'react';
import styles from './App.module.css';
import { ScaleSlider } from './components/ScaleSlider'
import { Neighborhood } from './components/Neighborhood'
import { ChildSelector } from './components/ChildSelector'
import { TimeLimitInput } from './components/TimeLimitInput'
import { TrickOrTreatButton } from './components/TrickOrTreatButton'
import { RouteInfo } from './components/RouteInfo'
import { gql, useQuery, useLazyQuery } from '@apollo/client'

const HOUSES = gql`
  {
    houses {
      uid
      name
      candy {
        name
        }
      x
      y 
    }
  }
`

const CHILDREN = gql`
  {
    children {
       name
       uid
    }
  }
 `

const ROUTE = gql`
  query Route($childId: String, $timeLimit: Int) {
    route(input: { childId: $childId, timeLimit: $timeLimit}) {
      child {
        name
        is_alive
        candy_preference {
          name
        }
      }
      collectedCandy {
        uid
        name
        mass
      }
      route {
        uid
        name
      }
    }
  }
`;


function App() {
  const { loading: loadingHouses, error: errorHouses, data: dataHouses } = useQuery(HOUSES)
  const { loading: loadingChildren, error: errorChildren, data: dataChildren } = useQuery(CHILDREN)
  const [getRoute, { loading: loadingRoute, error:errorRoute, data: dataRoute }] = useLazyQuery(ROUTE);

  const [selectedChild, setSelectedChild] = useState(null)
  const [timeLimit, setTimeLimit] = useState('0')
  const [scale, setScale] = useState(30)

  function trickOrTreat() {
    getRoute({
      variables: { childId: selectedChild, timeLimit: parseInt(timeLimit, 10) },
      fetchPolicy: 'network-only'
    })
  }

  let neighborhood
  if (loadingHouses) {
    neighborhood = <p>Loading...</p>
  } else if (errorHouses) {
    neighborhood = <p>Error :(</p>
  } else {
    neighborhood = <Neighborhood houses={dataHouses.houses} route={dataRoute} scale={scale} />
  }

  return (
    <div className={styles.app}>
      <div className={styles.leftColumn}>
        <ChildSelector loading={loadingChildren} error={errorChildren} data={dataChildren} setSelectedChild={setSelectedChild} />
        <TimeLimitInput setTimeLimit={setTimeLimit} />
        <TrickOrTreatButton trickOrTreat={trickOrTreat} />
        <ScaleSlider scale={scale} setScale={setScale} />
        <RouteInfo loading={loadingRoute} error={errorRoute} data={dataRoute}/>
      </div>
      <div className={styles.rightColumn}>
        {neighborhood}
      </div>
    </div>
  )
}

export default App;
