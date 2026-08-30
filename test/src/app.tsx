import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import './app.css'
import { Suspense, onMount } from 'solid-js'

/**
 * Marks the document once the client has hydrated. Rendered inside the same
 * Suspense boundary as the routes, so it only mounts once the route content
 * has resolved and its event handlers are attached.
 */
function HydrationMarker() {
  onMount(() => {
    document.documentElement.dataset.hydrated = 'true'
  })

  return null
}

export default function App() {
  return (
    <Router
      root={(props) => (
        <Suspense>
          {props.children}
          <HydrationMarker />
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
