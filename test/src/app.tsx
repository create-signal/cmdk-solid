import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import './app.css'
import { Suspense } from 'solid-js'

export default function App() {
  return (
    <Router root={(props) => <Suspense>{props.children}</Suspense>}>
      <FileRoutes />
    </Router>
  )
}
