import { Command } from 'cmdk-solid'
import { Show, createSignal, onMount } from 'solid-js'

const Page = () => {
  const [render, setRender] = createSignal(false)
  const [search, setSearch] = createSignal('')
  const [open, setOpen] = createSignal(true)
  onMount(() => setRender(true))

  return (
    <Show when={render()}>
      <div style={{ height: '3000px' }}>
        <button
          style={{ position: 'fixed', bottom: '0px', right: '0px' }}
          data-testid="toggle"
          onClick={() => setOpen((val) => !val)}
        >
          <Show when={open()} fallback={'Open'}>
            Close
          </Show>
        </button>
        <Show when={open()}>
          <Command class="root" value="Zucchini">
            <Command.Input value={search()} onValueChange={setSearch} placeholder="Search…" class="input" />
            <div style={{ 'max-height': '300px', 'overflow-y': 'scroll' }} data-testid="scrollable">
              <Command.List class="list">
                <Command.Item class="item">Apple</Command.Item>
                <Command.Item class="item">Banana</Command.Item>
                <Command.Item class="item">Cherry</Command.Item>
                <Command.Item class="item">Dragonfruit</Command.Item>
                <Command.Item class="item">Elderberry</Command.Item>
                <Command.Item class="item">Fig</Command.Item>
                <Command.Item class="item">Grape</Command.Item>
                <Command.Item class="item">Honeydew</Command.Item>
                <Command.Item class="item">Jackfruit</Command.Item>
                <Command.Item class="item">Kiwi</Command.Item>
                <Command.Item class="item">Lemon</Command.Item>
                <Command.Item class="item">Mango</Command.Item>
                <Command.Item class="item">Nectarine</Command.Item>
                <Command.Item class="item">Orange</Command.Item>
                <Command.Item class="item">Papaya</Command.Item>
                <Command.Item class="item">Quince</Command.Item>
                <Command.Item class="item">Raspberry</Command.Item>
                <Command.Item class="item">Strawberry</Command.Item>
                <Command.Item class="item">Tangerine</Command.Item>
                <Command.Item class="item">Ugli</Command.Item>
                <Command.Item class="item">Watermelon</Command.Item>
                <Command.Item class="item">Xigua</Command.Item>
                <Command.Item class="item">Yuzu</Command.Item>
                <Command.Item class="item">Zucchini</Command.Item>
              </Command.List>
            </div>
          </Command>
        </Show>
      </div>
    </Show>
  )
}

export default Page
