import { Command, CommandItemProps, useCommandState } from 'cmdk-solid'
import { For, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Popover } from '@kobalte/core'

const CommandMenu = () => {
  const [open, setOpen] = createSignal(true)
  let ref: HTMLDivElement | undefined

  // Toggle the menu when ⌘K is pressed
  onMount(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    onCleanup(() => document.removeEventListener('keydown', down))
  })

  return (
    <div>
      <div class="custom-portal" ref={ref}></div>
      <Command.Dialog
        open={open()}
        onOpenChange={setOpen}
        container={ref}
        modal={true}
        label="Global Command Menu"
        overlayClassName="custom-portal-overlay"
        contentClassName="custom-portal-content"
        preventScroll={false}
      >
        <Command.Input />
        <Command.List>
          <Command.Group heading="Letters">
            <Command.Item>a</Command.Item>
            <Command.Item>b</Command.Item>
            <Command.Separator />
            <Command.Item>c</Command.Item>
          </Command.Group>

          <Command.Item>Apple</Command.Item>
          <CustomEmpty />
        </Command.List>
      </Command.Dialog>
    </div>
  )
}

const CustomEmpty = () => {
  const search = useCommandState((state) => state.search)

  createEffect(() => {
    console.log('Searched for', search())
  })

  return <Command.Empty>No results found for {search()}</Command.Empty>
}

const CommandMenuWithPages = () => {
  const [search, setSearch] = createSignal('')
  const [pages, setPages] = createSignal<string[]>([])
  const page = () => pages()[pages().length - 1]

  return (
    <Command
      onKeyDown={(e) => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (e.key === 'Escape' || (e.key === 'Backspace' && !search())) {
          e.preventDefault()
          setPages((pages) => pages.slice(0, -1))
        }
      }}
    >
      <Command.Input value={search()} onValueChange={setSearch} />
      <Command.List>
        <Show when={!page()}>
          <Command.Item onSelect={() => setPages([...pages(), 'projects'])}>Search projects…</Command.Item>
          <Command.Item onSelect={() => setPages([...pages(), 'teams'])}>Join a team…</Command.Item>
        </Show>

        <Show when={page() === 'projects'}>
          <Command.Item>Project A</Command.Item>
          <Command.Item>Project B</Command.Item>
        </Show>

        <Show when={page() === 'teams'}>
          <Command.Item>Team 1</Command.Item>
          <Command.Item>Team 2</Command.Item>
        </Show>
      </Command.List>
    </Command>
  )
}

const SubItemsSearch = () => {
  const SubItem = (props: CommandItemProps) => {
    const search = useCommandState((state) => state.search)
    return (
      <Show when={!search()}>
        <Command.Item {...props} />
      </Show>
    )
  }

  return (
    <Command>
      <Command.Input />
      <Command.List>
        <Command.Item>Change theme…</Command.Item>
        <SubItem>Change theme to dark</SubItem>
        <SubItem>Change theme to light</SubItem>
      </Command.List>
    </Command>
  )
}

const asyncResource = async () => {
  await new Promise((r) => setTimeout(r, 5000))
  return ['apple', 'banana', 'cherry']
}

const AsyncCommandMenu = () => {
  const [loading, setLoading] = createSignal(false)
  const [items, setItems] = createSignal<string[]>([])

  onMount(() => {
    async function getItems() {
      setLoading(true)
      const res = await asyncResource()
      setItems(res)
      setLoading(false)
    }

    getItems()
  })

  return (
    <Command>
      <Command.Input />
      <Command.List>
        <Show when={loading()}>
          <Command.Loading>Fetching words…</Command.Loading>
        </Show>
        <For each={items()}>
          {(item) => {
            return <Command.Item value={item}>{item}</Command.Item>
          }}
        </For>
      </Command.List>
    </Command>
  )
}

const PopoverTest = () => {
  return (
    <Popover.Root>
      <Popover.Anchor>
        <Popover.Trigger>Toggle popover</Popover.Trigger>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content>
          <Command>
            <Command.Input />
            <Command.List>
              <Command.Item>Apple</Command.Item>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

const Page = () => {
  return (
    <div>
      <CommandMenu />
      <CommandMenuWithPages />
      <SubItemsSearch />

      <AsyncCommandMenu />
      <PopoverTest />
    </div>
  )
}

export default Page
