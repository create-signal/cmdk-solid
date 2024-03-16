import { Command } from 'cmdk'

const Page = () => {
  return (
    <div>
      <Command class="root">
        <Command.Input placeholder="Search…" class="input" />
        <Command.List class="list">
          <Command.Empty class="empty">No results.</Command.Empty>
          <Command.Item keywords={['key']} onSelect={() => console.log('Item selected')} class="item">
            Item
          </Command.Item>
          <Command.Item value="xxx" class="item">
            Value
          </Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
