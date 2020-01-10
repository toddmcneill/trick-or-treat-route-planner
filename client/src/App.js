import React, { useState } from 'react';
import styles from './App.module.css';
import { Neighborhood } from './components/Neighborhood'
import { ChildSelector } from './components/ChildSelector'
import { TimeLimitInput } from './components/TimeLimitInput'
import { TrickOrTreatButton } from './components/TrickOrTreatButton'
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
      }
      collectedCandy {
        name
      }
      route {
        uid
        name
      }
    }
  }
`;

const scale = 60

function App() {
  const { loading: loadingHouses, error: errorHouses, data: dataHouses } = useQuery(HOUSES)
  const { loading: loadingChildren, error: errorChildren, data: dataChildren } = useQuery(CHILDREN)
  const [getRoute, { loading: loadingRoute, error:errorRoute, data: dataRoute }] = useLazyQuery(ROUTE);

  const [selectedChild, setSelectedChild] = useState(null)
  const [timeLimit, setTimeLimit] = useState(0)

  function trickOrTreat() {
    getRoute({
      variables: { childId: selectedChild, timeLimit: parseInt(timeLimit, 10) },
      fetchPolicy: 'network-only'
    })
  }

  return (
    <div className={styles.app}>
      <div className={styles.leftColumn}>
        <ChildSelector loading={loadingChildren} error={errorChildren} data={dataChildren} setSelectedChild={setSelectedChild} />
        <TimeLimitInput setTimeLimit={setTimeLimit} />
        <TrickOrTreatButton trickOrTreat={trickOrTreat} />
      </div>
      <div className={styles.rightColumn}>
        <Neighborhood loading={loadingHouses} error={errorHouses} data={dataHouses} route={dataRoute} scale={scale} />
      </div>
    </div>
  )
}

export default App;
