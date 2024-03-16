import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './styles/globals.scss'

import './styles/cmdk/vercel.scss'
import './styles/cmdk/linear.scss'
import './styles/cmdk/raycast.scss'
import './styles/cmdk/framer.scss'

const title = '⌘K'
const description = 'Fast, composable, unstyled command menu for SolidJS'
const siteUrl = 'https://cmdk.paco.me'

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>
            {description} - {title}
          </Title>

          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
