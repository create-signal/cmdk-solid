import { Command } from 'cmdk-solid'
import { Show, createSignal } from 'solid-js'

const Page = () => {
  const [unmount, setUnmount] = createSignal(false)
  const [mount, setMount] = createSignal(false)
  const [many, setMany] = createSignal(false)
  const [forceMount, setForceMount] = createSignal(false)

  return (
    <div>
      <button data-testid="mount" onClick={() => setMount(!mount())}>
        Toggle item B
      </button>
      {JSON.stringify(mount())}
      <button data-testid="unmount" onClick={() => setUnmount(!unmount())}>
        Toggle item A
      </button>

      <button data-testid="many" onClick={() => setMany(!many())}>
        Toggle many items
      </button>

      <button data-testid="forceMount" onClick={() => setForceMount(!forceMount())}>
        Force mount item A
      </button>

      <Command>
        <Command.Input placeholder="Search…" />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>
          <Show when={!unmount()}>
            <Command.Item forceMount={forceMount()}>A</Command.Item>
          </Show>
          <Show when={many()}>
            <>
              <Command.Item>1</Command.Item>
              <Command.Item>2</Command.Item>
              <Command.Item>3</Command.Item>
            </>
          </Show>
          <Show when={mount()}>
            <Command.Item>B</Command.Item>
          </Show>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
