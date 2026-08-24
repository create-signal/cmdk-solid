import { Meta, Title } from '@solidjs/meta'
import { Loading } from 'solid-js'
import { Router } from './router'
import './styles/globals.scss'

import './styles/cmdk/framer.scss'
import './styles/cmdk/linear.scss'
import './styles/cmdk/raycast.scss'
import './styles/cmdk/vercel.scss'

const title = '⌘K for SolidJS'
const description = 'Fast, composable, unstyled command menu for SolidJS'

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>
            {description} - {title}
          </Title>
          <Meta name="description" content={description} />

          <Loading>{props.children}</Loading>
        </>
      )}
    </Router>
  )
}
