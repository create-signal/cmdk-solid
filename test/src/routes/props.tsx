import { useSearchParams, useIsRouting } from '@solidjs/router'
import { Command } from 'cmdk-solid'
import { createEffect, createSignal } from 'solid-js'

const Page = () => {
  const [value, setValue] = createSignal('ant')
  const [search, setSearch] = createSignal('')
  const [shouldFilter, setShouldFilter] = createSignal(true)
  const [customFilter, setCustomFilter] = createSignal(false)
  const [params] = useSearchParams()
  const isRouting = useIsRouting()

  createEffect(() => {
    if (!isRouting()) {
      setShouldFilter(params.shouldFilter === 'false' ? false : true)
      setCustomFilter(params.customFilter === 'true' ? true : false)
      setValue(params.initialValue ?? 'ant')
    }
  })

  return (
    <div>
      <div data-testid="value">{value()}</div>
      <div data-testid="search">{search()}</div>

      <button data-testid="controlledValue" onClick={() => setValue('anteater')}>
        Change value
      </button>
      <button data-testid="controlledSearch" onClick={() => setSearch('eat')}>
        Change search value
      </button>

      <Command
        shouldFilter={shouldFilter()}
        value={value()}
        onValueChange={setValue}
        filter={
          customFilter()
            ? (item: string | undefined, search: string | undefined) => {
                console.log(item, search)
                if (!search || !item) return 1
                return item.endsWith(search) ? 1 : 0
              }
            : undefined
        }
      >
        <Command.Input placeholder="Search…" value={search()} onValueChange={setSearch} />
        <Command.List>
          <Command.Item>ant</Command.Item>
          <Command.Item>anteater</Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
