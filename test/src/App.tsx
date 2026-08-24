import { Loading } from 'solid-js'
import { Router } from './router'
import './app.css'

export default function App() {
  return <Router>{(props) => <Loading>{props.children}</Loading>}</Router>
}
