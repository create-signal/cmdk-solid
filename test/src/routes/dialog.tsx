import { Command } from 'cmdk-solid'
import { createSignal, onMount } from 'solid-js'

const Page = () => {
  const [open, setOpen] = createSignal(false)

  onMount(() => {
    setOpen(true)
  })

  return (
    <div>
      <Command.Dialog open={open()} onOpenChange={setOpen}>
        <Command.Input placeholder="Search…" />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>
          <Command.Item onSelect={() => console.log('Item selected')}>Item</Command.Item>
          <Command.Item value="xxx">Value</Command.Item>
        </Command.List>
      </Command.Dialog>
    </div>
  )
}

export default Page
