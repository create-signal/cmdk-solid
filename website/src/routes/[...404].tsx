import { Title } from '@solidjs/meta'
import { httpStatus } from '@solidjs/web'

export default function NotFound() {
  httpStatus(404)

  return (
    <main>
      <Title>Not Found</Title>
      <h1>Page Not Found</h1>
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </main>
  )
}
