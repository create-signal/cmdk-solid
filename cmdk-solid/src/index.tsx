import { Dialog as KobalteDialog } from '@kobalte/core'
import {
  Accessor,
  Component,
  JSX,
  ParentComponent,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  mergeProps,
  on,
  onCleanup,
  onMount,
  splitProps,
  untrack,
  useContext,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { commandScore } from './command-score'

type Children = { children?: JSX.Element }
type DivProps = JSX.IntrinsicElements['div']

export type CommandLoadingProps = Children &
  DivProps & {
    /** Estimated progress of loading asynchronous options. */
    progress?: number
    /**
     * Accessible label for this loading progressbar. Not shown visibly.
     */
    label?: string
  }

export type CommandEmptyProps = Children & DivProps & {}
export type CommandSeparatorProps = DivProps & {
  /** Whether this separator should always be rendered. Useful if you disable automatic filtering. */
  alwaysRender?: boolean
}
export type CommandDialogProps = KobalteDialog.DialogRootProps &
  CommandRootProps & {
    /** Provide a className to the Dialog overlay. */
    overlayClassName?: string
    /** Provide a className to the Dialog content. */
    contentClassName?: string
    /** Provide a custom element the Dialog should portal into. */
    container?: HTMLElement
  }
export type CommandListProps = Children &
  DivProps & {
    /**
     * Accessible label for this List of suggestions. Not shown visibly.
     */
    label?: string
  }
export type CommandItemProps = Children &
  Omit<DivProps, 'disabled' | 'onSelect' | 'value'> & {
    /** Whether this item is currently disabled. */
    disabled?: boolean
    /** Event handler for when this item is selected, either via click or keyboard selection. */
    onSelect?: (value: string) => void
    /**
     * A unique value for this item.
     * If no value is provided, it will be inferred from `children` or the rendered `textContent`. If your `textContent` changes between renders, you _must_ provide a stable, unique `value`.
     */
    value?: string
    /** Optional keywords to match against when filtering. */
    keywords?: string[]
    /** Whether this item is forcibly rendered regardless of filtering. */
    forceMount?: boolean
  }
export type CommandGroupProps = Children &
  Omit<DivProps, 'heading' | 'value'> & {
    /** Optional heading to render for this group. */
    heading?: JSX.Element
    /** If no heading is provided, you must provide a value that is unique for this group. */
    value?: string
    /** Whether this group is forcibly rendered regardless of filtering. */
    forceMount?: boolean
  }
export type CommandInputProps = Omit<JSX.IntrinsicElements['input'], 'value' | 'onChange' | 'type'> & {
  /**
   * Optional controlled state for the value of the search input.
   */
  value?: string
  /**
   * Event handler called when the search value changes.
   */
  onValueChange?: (search: string) => void
}
export type CommandRootProps = Children &
  DivProps & {
    /**
     * Accessible label for this command menu. Not shown visibly.
     */
    label?: string
    /**
     * Optionally set to `false` to turn off the automatic filtering and sorting.
     * If `false`, you must conditionally render valid items based on the search query yourself.
     */
    shouldFilter?: boolean
    /**
     * Custom filter function for whether each command menu item should matches the given search query.
     * It should return a number between 0 and 1, with 1 being the best match and 0 being hidden entirely.
     * By default, uses the `command-score` library.
     */
    filter?: (value: string, search: string, keywords?: string[]) => number
    /**
     * Optional default item value when it is initially rendered.
     */
    defaultValue?: string
    /**
     * Optional controlled state of the selected command menu item.
     */
    value?: string
    /**
     * Event handler called when the selected item of the menu changes.
     */
    onValueChange?: (value: string) => void
    /**
     * Optionally set to `true` to turn on looping around when using the arrow keys.
     */
    loop?: boolean
    /**
     * Optionally set to `true` to disable selection via pointer events.
     */
    disablePointerSelection?: boolean
    /**
     * Set to `false` to disable ctrl+n/j/p/k shortcuts. Defaults to `true`.
     */
    vimBindings?: boolean
  }

type Context = {
  value: (id: string, value: Accessor<string>, keywords?: Accessor<string[] | undefined>) => () => void
  item: (id: string, groupId?: string) => () => void
  group: (id: string) => () => void
  filter: () => boolean
  label: Accessor<string>
  disablePointerSelection: Accessor<boolean>
  // Ids
  listId: string
  labelId: string
  inputId: string
  // Refs
  listInnerRef: Accessor<HTMLDivElement | null>
  setListInnerRef: (el: HTMLDivElement | null) => void
}

type ItemValue = {
  value: Accessor<string>
  keywords?: Accessor<string[] | undefined>
}

type State = {
  search: string
  value: string
  filtered: { count: number; items: Record<string, number>; groups: string[] }
  items: string[]
  groups: Record<string, string[]>
  ids: Record<string, ItemValue>
}

type Store = {
  state: State
  setState: <K extends keyof State>(key: K, value: State[K], opts?: any) => void
}

type Group = {
  id: string
  forceMount?: boolean
}

const GROUP_SELECTOR = `[cmdk-group=""]`
const GROUP_HEADING_SELECTOR = `[cmdk-group-heading=""]`
const ITEM_SELECTOR = `[cmdk-item=""]`
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`
const SELECT_EVENT = `cmdk-item-select`
const VALUE_ATTR = `data-value`
const DIALOG_ROOT_KEYS = [
  'open',
  'defaultOpen',
  'onOpenChange',
  'id',
  'modal',
  'preventScroll',
  'forceMount',
  'translations',
] as const
const defaultFilter: NonNullable<CommandRootProps['filter']> = (value, search, keywords) =>
  commandScore(value, search, keywords)

const CommandContext = createContext<Context>()
const useCommand = () => useContext(CommandContext)!
const StoreContext = createContext<Store>()
const useStore = () => useContext(StoreContext)!
const GroupContext = createContext<Accessor<Group | undefined>>(() => undefined)

const Command: Component<CommandRootProps> = (props) => {
  const [uncontrolledValue, setUncontrolledValue] = createSignal(props.value?.trim() ?? props.defaultValue ?? '')

  const [state, setState] = createStore<State>({
    search: '',
    get value(): State['value'] {
      return props.value !== undefined ? props.value.trim() : uncontrolledValue()
    },
    get filtered(): State['filtered'] {
      return filtered()
    },
    items: [],
    groups: {},
    ids: {},
  })

  const mergedProps = mergeProps({ vimBindings: true, disablePointerSelection: false }, props)

  const filtered = createMemo<State['filtered']>(() => {
    const skipFiltering = !state.search || mergedProps.shouldFilter === false

    const items: Record<string, number> = state.items.reduce(
      (acc, id: string) => {
        const registered = state.ids[id]
        acc[id] = skipFiltering ? 1 : registered ? score(registered.value(), registered.keywords?.()) : 0
        return acc
      },
      {} as Record<string, number>,
    )
    const groups = Object.keys(state.groups).filter((groupId) => {
      return state.groups[groupId]!.some((id: string) => (items[id] || 0) > 0)
    })
    const count = Object.values(items).filter((score) => score > 0).length
    return { count, items, groups }
  })

  const [, etc] = splitProps(mergedProps, [
    'label',
    'children',
    'value',
    'onValueChange',
    'filter',
    'shouldFilter',
    'loop',
    'disablePointerSelection',
    'vimBindings',
  ])

  const listId = createUniqueId()
  const labelId = createUniqueId()
  const inputId = createUniqueId()

  const [listInnerRef, setListInnerRef] = createSignal<HTMLDivElement | null>(null)

  const schedule = useSchedule()

  //TODO When getSelectedItem changes we should scroll it into view
  onMount(() => {
    schedule(6, scrollSelectedIntoView)
  })

  const store: Store = {
    state,
    setState: (key, value, opts) => {
      if (untrack(() => Object.is(state[key], value))) return
      if (key === 'value') {
        setUncontrolledValue(value as State['value'])
      } else {
        setState(key, value)
      }

      if (key === 'search') {
        schedule(8, selectFirstItem)
      } else if (key === 'value') {
        // opts is a boolean referring to whether it should NOT be scrolled into view
        if (!opts) {
          // Scroll the selected item into view
          schedule(5, scrollSelectedIntoView)
        }
        if (mergedProps.value !== undefined) {
          // If controlled, just call the callback instead of updating state internally
          const newValue = (value ?? '') as string
          mergedProps.onValueChange?.(newValue)
          return
        }
      }
    },
  }

  const context: Context = {
    value: (id, value, keywords) => {
      setState(
        produce((draft) => {
          draft.ids[id] = { value, keywords }
        }),
      )

      return () => {
        setState(
          produce((draft) => {
            delete draft.ids[id]
          }),
        )
      }
    },
    // Track item lifecycle (mount, unmount)
    item: (id: string, groupId?: string) => {
      if (!listInnerRef()) {
        console.warn('Mount Command.Item inside a Command.List component.')
      }
      setState(
        produce((draft) => {
          if (!draft.items.includes(id)) draft.items.push(id)
          if (groupId) {
            const group = (draft.groups[groupId] ??= [])
            if (!group.includes(id)) group.push(id)
          }
        }),
      )

      // Could be initial mount, select the first item if none already selected
      schedule(3, () => {
        if (!state.value) {
          selectFirstItem()
        }
      })

      return () => {
        setState(
          produce((draft) => {
            const index = draft.items.indexOf(id)
            if (index !== -1) draft.items.splice(index, 1)
            if (groupId) {
              const group = draft.groups[groupId]
              const groupIndex = group?.indexOf(id) ?? -1
              if (group && groupIndex !== -1) group.splice(groupIndex, 1)
            }
          }),
        )

        // Batch this, multiple items could be removed in one pass
        const selectedItem = getSelectedItem()
        if (selectedItem?.getAttribute('id') === id) schedule(1, () => selectFirstItem())
      }
    },
    // Track group lifecycle (mount, unmount)
    group: (id) => {
      if (!listInnerRef()) {
        console.warn('Mount Command.Group inside a Command.List component.')
      }
      setState(
        produce((draft) => {
          draft.groups[id] ??= []
        }),
      )

      return () => {
        setState(
          produce((draft) => {
            delete draft.groups[id]
          }),
        )
      }
    },
    filter: () => {
      return mergedProps.shouldFilter !== false
    },
    label: () => mergedProps.label || props['aria-label'] || '',
    disablePointerSelection: () => !!mergedProps.disablePointerSelection,
    listId,
    inputId,
    labelId,
    listInnerRef,
    setListInnerRef,
  }

  function score(value: string, keywords?: string[]) {
    const filter = mergedProps.filter ?? defaultFilter
    return value ? filter(value, state.search, keywords) : 0
  }

  function selectFirstItem() {
    const item = getValidItems().find((item) => item.getAttribute('aria-disabled') !== 'true')
    const value = item?.getAttribute(VALUE_ATTR) || ''
    store.setState('value', value)
  }

  function scrollSelectedIntoView() {
    requestAnimationFrame(() => {
      const item = getSelectedItem()

      if (item) {
        if (item.parentElement?.firstChild === item) {
          // First item in Group, ensure heading is in view
          item.closest(GROUP_SELECTOR)?.querySelector(GROUP_HEADING_SELECTOR)?.scrollIntoView({ block: 'nearest' })
        }

        // Ensure the item is always in view
        item.scrollIntoView({ block: 'nearest' })
      }
    })
  }

  function getSelectedItem() {
    return listInnerRef()?.querySelector(`${ITEM_SELECTOR}[aria-selected="true"]`)
  }

  function getValidItems() {
    return Array.from(listInnerRef()?.querySelectorAll(VALID_ITEM_SELECTOR) || [])
  }

  function updateSelectedToIndex(index: number) {
    const items = getValidItems()
    const item = items[index]
    if (item) store.setState('value', item.getAttribute(VALUE_ATTR) || '')
  }

  function updateSelectedByItem(change: 1 | -1) {
    const selected = getSelectedItem()
    const items = getValidItems()
    const index = items.findIndex((item) => item === selected)

    // Get item at this index
    let newSelected = items[index + change]

    if (mergedProps.loop) {
      newSelected =
        index + change < 0
          ? items[items.length - 1]
          : index + change === items.length
          ? items[0]
          : items[index + change]
    }

    if (newSelected) store.setState('value', newSelected.getAttribute(VALUE_ATTR) || '')
  }

  function updateSelectedByGroup(change: 1 | -1) {
    const selected = getSelectedItem()
    let group = selected?.closest(GROUP_SELECTOR)
    let item: HTMLElement | null = null

    while (group && !item) {
      group = change > 0 ? findNextSibling(group, GROUP_SELECTOR) : findPreviousSibling(group, GROUP_SELECTOR)
      item = group?.querySelector(VALID_ITEM_SELECTOR) || null
    }

    if (item) {
      store.setState('value', item.getAttribute(VALUE_ATTR) || '')
    } else {
      updateSelectedByItem(change)
    }
  }

  const last = () => updateSelectedToIndex(getValidItems().length - 1)

  const next = (e: KeyboardEvent) => {
    e.preventDefault()

    if (e.metaKey) {
      // Last item
      last()
    } else if (e.altKey) {
      // Next group
      updateSelectedByGroup(1)
    } else {
      // Next item
      updateSelectedByItem(1)
    }
  }

  const prev = (e: KeyboardEvent) => {
    e.preventDefault()

    if (e.metaKey) {
      // First item
      updateSelectedToIndex(0)
    } else if (e.altKey) {
      // Previous group
      updateSelectedByGroup(-1)
    } else {
      // Previous item
      updateSelectedByItem(-1)
    }
  }

  return (
    <div
      tabIndex={-1}
      {...etc}
      cmdk-root=""
      onKeyDown={(e) => {
        //@ts-ignore
        etc.onKeyDown?.(e)

        if (!e.defaultPrevented) {
          switch (e.key) {
            case 'n':
            case 'j': {
              // vim keybind down
              if (mergedProps.vimBindings && e.ctrlKey) {
                next(e)
              }
              break
            }
            case 'ArrowDown': {
              next(e)
              break
            }
            case 'p':
            case 'k': {
              // vim keybind up
              if (mergedProps.vimBindings && e.ctrlKey) {
                prev(e)
              }
              break
            }
            case 'ArrowUp': {
              prev(e)
              break
            }
            case 'Home': {
              // First item
              e.preventDefault()
              updateSelectedToIndex(0)
              break
            }
            case 'End': {
              // Last item
              e.preventDefault()
              last()
              break
            }
            case 'Enter': {
              // Check if IME composition is finished before triggering onSelect
              // This prevents unwanted triggering while user is still inputting text with IME
              // e.keyCode === 229 is for the Japanese IME and Safari.
              // isComposing does not work with Japanese IME and Safari combination.
              if (!e.isComposing && e.keyCode !== 229) {
                // Trigger item onSelect
                e.preventDefault()
                const item = getSelectedItem()
                if (item) {
                  const event = new Event(SELECT_EVENT)
                  item.dispatchEvent(event)
                }
              }
            }
          }
        }
      }}
    >
      <label
        cmdk-label=""
        for={context.inputId}
        id={context.labelId}
        // Screen reader only
        style={srOnlyStyles}
      >
        {mergedProps.label}
      </label>
      <StoreContext.Provider value={store}>
        <CommandContext.Provider value={context}>{props.children}</CommandContext.Provider>
      </StoreContext.Provider>
    </div>
  )
}

/**
 * Command menu item. Becomes active on pointer enter or through keyboard navigation.
 * Preferably pass a `value`, otherwise the value will be inferred from `children` or
 * the rendered item's `textContent`.
 */
const Item: ParentComponent<CommandItemProps> = (props) => {
  const store = useStore()
  const id = createUniqueId()
  const [ref, setRef] = createSignal<HTMLDivElement>()
  const groupContext = useContext(GroupContext)
  const context = useCommand()
  const rendered = createMemo<boolean>((wasRendered) => wasRendered || (!!ref() && !props.disabled), false)

  onMount(() => {
    const unregisterValue = context.value(id, value, () => props.keywords)
    if (forceMount()) {
      onCleanup(unregisterValue)
      return
    }

    const unregisterItem = context.item(id, groupContext()?.id)
    onCleanup(() => {
      unregisterItem()
      unregisterValue()
    })
  })

  const [textValue, setTextValue] = createSignal('')

  createEffect(
    on(ref, (el) => {
      if (el) setTextValue(el.textContent || '')
    }),
  )

  const value = () => props.value || textValue()

  createEffect(
    on([value, ref], ([value, el]) => {
      el?.setAttribute(VALUE_ATTR, value)
    }),
  )

  const forceMount = () => props.forceMount ?? groupContext()?.forceMount
  const selected = useCmdk((state) => value() && value() == state.value)

  const render = useCmdk((state) =>
    !rendered()
      ? true
      : forceMount()
      ? true
      : context.filter() === false
      ? true
      : !state.search
      ? true
      : (state.filtered.items[id] || 0) > 0,
  )

  createEffect(
    on(ref, (el) => {
      if (!el) return
      el.addEventListener(SELECT_EVENT, onSelect)
      onCleanup(() => el.removeEventListener(SELECT_EVENT, onSelect))
    }),
  )

  function onSelect() {
    select()
    props.onSelect?.(value())
  }

  function select() {
    store.setState('value', value(), true)
  }

  const [, etc] = splitProps(props, ['disabled', 'onSelect', 'value', 'forceMount', 'keywords'])

  return (
    <Show when={render()}>
      <div
        {...etc}
        ref={(el) => setRef(el)}
        id={id}
        cmdk-item=""
        role="option"
        aria-disabled={props.disabled ? 'true' : 'false'}
        aria-selected={selected() ? 'true' : 'false'}
        data-disabled={props.disabled ? 'true' : 'false'}
        data-selected={selected() ? 'true' : 'false'}
        onPointerMove={props.disabled || context.disablePointerSelection() ? undefined : select}
        onClick={props.disabled ? undefined : onSelect}
      >
        {props.children}
      </div>
    </Show>
  )
}

/**
 * Group command menu items together with a heading.
 * Grouped items are always shown together.
 */
const Group: ParentComponent<CommandGroupProps> = (props) => {
  const [, etc] = splitProps(props, ['heading', 'value', 'forceMount'])
  const id = createUniqueId()
  const [ref, setRef] = createSignal<HTMLDivElement>()
  const [headerRef, setHeaderRef] = createSignal<HTMLDivElement>()
  const headingId = createUniqueId()
  const context = useCommand()
  const render = useCmdk((state) => {
    return props.forceMount
      ? true
      : context.filter() === false
      ? true
      : !state.search
      ? true
      : state.filtered.groups.includes(id)
  })

  onMount(() => {
    const unregisterValue = context.value(id, value)
    const unregisterGroup = context.group(id)
    onCleanup(() => {
      unregisterGroup()
      unregisterValue()
    })
  })

  const [headerValue, setHeaderValue] = createSignal('')

  createEffect(
    on(headerRef, (el) => {
      if (el) setHeaderValue(el.textContent || '')
    }),
  )

  const value = () => props.value || headerValue()

  createEffect(
    on([value, ref], ([value, el]) => {
      el?.setAttribute(VALUE_ATTR, value)
    }),
  )

  const contextValue = () => ({ id, forceMount: props.forceMount })

  return (
    <div
      ref={mergeRefs<HTMLDivElement>(setRef, props.ref)}
      {...etc}
      cmdk-group=""
      id={id}
      role="presentation"
      hidden={render() ? undefined : true}
    >
      <Show when={props.heading}>
        <div cmdk-group-heading="" ref={(el) => setHeaderRef(el)} aria-hidden="true" id={headingId}>
          {props.heading}
        </div>
      </Show>

      <div cmdk-group-items="" role="group" aria-labelledby={props.heading ? headingId : undefined}>
        <GroupContext.Provider value={contextValue}>{props.children}</GroupContext.Provider>
      </div>
    </div>
  )
}

/**
 * A visual and semantic separator between items or groups.
 * Visible when the search query is empty or `alwaysRender` is true, hidden otherwise.
 */
const Separator: Component<CommandSeparatorProps> = (props) => {
  const [, etc] = splitProps(props, ['alwaysRender'])

  const render = useCmdk((state) => !state.search)

  return (
    <Show when={props.alwaysRender || render()}>
      <div {...etc} cmdk-separator="" role="separator" />
    </Show>
  )
}

/**
 * Command menu input.
 * All props are forwarded to the underyling `input` element.
 */
const Input: Component<CommandInputProps> = (props) => {
  const [, etc] = splitProps(props, ['onValueChange', 'ref'])
  const isControlled = () => props.value != null
  const store = useStore()
  const search = useCmdk((state) => state.search)
  const value = useCmdk((state) => state.value)
  const context = useCommand()

  const selectedItemId = createMemo(() => {
    const item = context
      .listInnerRef()
      ?.querySelector(`${ITEM_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(value())}"]`)
    return item?.getAttribute('id') || undefined
  })

  createEffect(
    on(
      () => props.value,
      (value) => {
        if (value != null) {
          store.setState('search', value)
        }
      },
    ),
  )

  return (
    <input
      ref={props.ref}
      {...etc}
      cmdk-input=""
      autocomplete="off"
      autocorrect="off"
      spellcheck={false}
      aria-autocomplete="list"
      role="combobox"
      aria-expanded="true"
      aria-controls={context.listId}
      aria-labelledby={context.labelId}
      aria-activedescendant={selectedItemId()}
      id={context.inputId}
      type="text"
      value={isControlled() ? props.value : search()}
      onInput={(e) => {
        if (!isControlled()) {
          store.setState('search', e.currentTarget.value)
        }

        props.onValueChange?.(e.currentTarget.value)
      }}
    />
  )
}

/**
 * Contains `Item`, `Group`, and `Separator`.
 * Use the `--cmdk-list-height` CSS variable to animate height based on the number of results.
 */
const List: ParentComponent<CommandListProps> = (props) => {
  const mergedProps = mergeProps({ label: 'Suggestions' }, props)
  const [, etc] = splitProps(mergedProps, ['label', 'children', 'ref'])
  const [wrapperRef, setWrapperRef] = createSignal<HTMLDivElement>()
  const [sizerRef, setSizerRef] = createSignal<HTMLDivElement>()

  const context = useCommand()

  createEffect(
    on([wrapperRef, sizerRef], ([wrapper, sizer]) => {
      if (!wrapper || !sizer) return

      let animationFrame: number

      const observer = new ResizeObserver(() => {
        animationFrame = requestAnimationFrame(() => {
          wrapper.style.setProperty(`--cmdk-list-height`, sizer.offsetHeight.toFixed(1) + 'px')
        })
      })
      observer.observe(sizer)

      onCleanup(() => {
        cancelAnimationFrame(animationFrame)
        observer.unobserve(sizer)
      })
    }),
  )

  return (
    <div
      ref={mergeRefs<HTMLDivElement>(setWrapperRef, mergedProps.ref)}
      {...etc}
      cmdk-list=""
      role="listbox"
      aria-label={mergedProps.label}
      id={context.listId}
    >
      {SlottableWithNestedChildren(props, (child) => (
        <div ref={mergeRefs<HTMLDivElement>(setSizerRef, context.setListInnerRef)} cmdk-list-sizer="">
          {child}
        </div>
      ))}
    </div>
  )
}

/**
 * Renders the command menu in a Kobalte Dialog.
 */
const Dialog: ParentComponent<CommandDialogProps> = (props) => {
  const [, dialogRootProps, etc] = splitProps(
    props,
    ['overlayClassName', 'contentClassName', 'container'],
    DIALOG_ROOT_KEYS,
  )
  return (
    <KobalteDialog.Root {...dialogRootProps}>
      <KobalteDialog.Portal mount={props.container}>
        <KobalteDialog.Overlay cmdk-overlay="" class={props.overlayClassName} />
        <KobalteDialog.Content aria-label={props.label} cmdk-dialog="" class={props.contentClassName}>
          <Command {...etc} />
        </KobalteDialog.Content>
      </KobalteDialog.Portal>
    </KobalteDialog.Root>
  )
}

/**
 * Automatically renders when there are no results for the search query.
 */
const Empty: ParentComponent<CommandEmptyProps> = (props) => {
  const [mounted, setMounted] = createSignal(false)

  const render = useCmdk((state) => state.filtered.count === 0 && mounted())

  onMount(() => {
    setMounted(true)
  })
  return (
    <Show when={render()}>
      <div {...props} cmdk-empty="" role="presentation" />
    </Show>
  )
}

/**
 * You should conditionally render this with `progress` while loading asynchronous items.
 */
const Loading: ParentComponent<CommandLoadingProps> = (props) => {
  const mergedProps = mergeProps({ label: 'Loading...' }, props)

  const [, etc] = splitProps(mergedProps, ['progress', 'children', 'label'])

  return (
    <div
      {...etc}
      cmdk-loading=""
      role="progressbar"
      aria-valuenow={mergedProps.progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={mergedProps.label}
    >
      {SlottableWithNestedChildren(props, (child) => (
        <div aria-hidden="true">{child}</div>
      ))}
    </div>
  )
}

const pkg = Object.assign(Command, {
  List,
  Item,
  Input,
  Group,
  Separator,
  Dialog,
  Empty,
  Loading,
})

export { pkg as Command, defaultFilter, useCmdk as useCommandState }

export {
  Dialog as CommandDialog,
  Empty as CommandEmpty,
  Group as CommandGroup,
  Input as CommandInput,
  Item as CommandItem,
  List as CommandList,
  Loading as CommandLoading,
  Command as CommandRoot,
  Separator as CommandSeparator,
}

/**
 *
 *
 * Helpers
 *
 *
 */

function findNextSibling(el: Element, selector: string) {
  let sibling = el.nextElementSibling

  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.nextElementSibling
  }
}

function findPreviousSibling(el: Element, selector: string) {
  let sibling = el.previousElementSibling

  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.previousElementSibling
  }
}

/** Run a selector against the store state. */
function useCmdk<T = any>(selector: (state: State) => T) {
  const store = useStore()
  return () => selector(store.state)
}

/**
 * Runs a callback on the next microtask, once per id. Callbacks read the DOM,
 * so they need to run after pending reactive writes have rendered.
 */
const useSchedule = () => {
  let fns = new Map<string | number, () => void>()
  let queued = false

  return (id: string | number, cb: () => void) => {
    fns.set(id, cb)
    if (queued) return
    queued = true

    queueMicrotask(() => {
      queued = false

      const pending = fns
      fns = new Map()
      pending.forEach((f) => {
        f()
      })
    })
  }
}

function mergeRefs<T>(...refs: (((el: T) => void) | T | undefined)[]) {
  return (el: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') (ref as (el: T) => void)(el)
    }
  }
}

function SlottableWithNestedChildren(
  props: { asChild?: boolean; children?: JSX.Element },
  render: (child: JSX.Element) => JSX.Element,
) {
  return render(props.children)
}

const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  'white-space': 'nowrap',
  'border-width': '0',
} as const
