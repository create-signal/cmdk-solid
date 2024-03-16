import { Command } from 'cmdk'
import { createSignal } from 'solid-js'

const Page = () => {
  const [count, setCount] = createSignal(0)

  return (
    <div>
      <button data-testid="increment" onClick={() => setCount((c) => c + 1)}>
        Increment count
      </button>

      <Command>
        <Command.Input placeholder="Search…" />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>
          <Command.Item value={`Item A ${count()}`}>Item A {count()}</Command.Item>
          <Command.Item value={`Item B ${count()}`}>Item B {count()}</Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
