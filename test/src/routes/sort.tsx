import { Command } from 'cmdk-solid'

const Page = () => {
  return (
    <div>
      <Command class="root">
        <Command.Input placeholder="Search…" class="input" />
        <Command.List class="list">
          <Command.Empty class="empty">No results.</Command.Empty>
          <Command.Group heading="group 1">
            <Command.Item class="item" keywords={['strawberry']}>
              Apple
            </Command.Item>
            <Command.Item class="item" keywords={['strawberry']}>
              Rasberry
            </Command.Item>
          </Command.Group>
          <Command.Group heading="group 2">
            <Command.Item class="item" keywords={['strawberry']}>
              Dewberry
            </Command.Item>
            <Command.Item class="item">Strawberry</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
