import { Command } from 'cmdk'
import { Show, createSignal } from 'solid-js'

const Page = () => {
  const [search, setSearch] = createSignal('')
  const [forceMount, setForceMount] = createSignal(false)

  return (
    <div>
      <button data-testid="forceMount" onClick={() => setForceMount(!forceMount())}>
        Force mount Group Letters
      </button>

      <Command>
        <Command.Input placeholder="Search…" value={search()} onValueChange={setSearch} />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>
          <Command.Group heading="Animals">
            <Command.Item>Giraffe</Command.Item>
            <Command.Item>Chicken</Command.Item>
          </Command.Group>

          <Command.Group forceMount={forceMount()} heading="Letters">
            <Command.Item>A</Command.Item>
            <Command.Item>B</Command.Item>
            <Command.Item>Z</Command.Item>
          </Command.Group>

          <Show when={search()}>
            <Command.Group heading="Numbers">
              <Command.Item>One</Command.Item>
              <Command.Item>Two</Command.Item>
              <Command.Item>Three</Command.Item>
            </Command.Group>
          </Show>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
