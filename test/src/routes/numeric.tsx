import { Command } from 'cmdk-solid'

const Page = () => {
  return (
    <div>
      <Command class="root">
        <Command.Input placeholder="Search…" class="input" />
        <Command.List class="list">
          <Command.Empty class="empty">No results.</Command.Empty>
          <Command.Item value="removed" class="item">
            To be removed
          </Command.Item>
          <Command.Item value="foo.bar112.value" class="item">
            Not to be removed
          </Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
