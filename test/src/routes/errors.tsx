import { Command } from 'cmdk-solid'

const Page = () => {
  return (
    <Command>
      <Command.Empty>No results.</Command.Empty>
      <Command.Group heading="Animals">
        <Command.Item>Giraffe</Command.Item>
        <Command.Item>Chicken</Command.Item>
      </Command.Group>
      <Command.Group heading="Letters">
        <Command.Item>A</Command.Item>
        <Command.Item>B</Command.Item>
        <Command.Item>Z</Command.Item>
      </Command.Group>
      <Command.Group heading="Numbers">
        <Command.Item>One</Command.Item>
        <Command.Item>Two</Command.Item>
        <Command.Item>Three</Command.Item>
      </Command.Group>
    </Command>
  )
}

export default Page
