import { Popover } from '@kobalte/core'
import { Command } from 'cmdk'
import { For, JSX, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { FigmaIcon, LinearIcon, Logo, RaycastIcon, SlackIcon, YouTubeIcon } from '../../components'

export function RaycastCMDK() {
  const [value, setValue] = createSignal('linear')
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null)
  const [listRef, setListRef] = createSignal<HTMLInputElement | null>(null)

  createEffect(() => {
    inputRef()?.focus()
  })

  return (
    <div class="raycast">
      <Command value={value()} onValueChange={setValue}>
        <div cmdk-raycast-top-shine="" />
        <Command.Input ref={setInputRef} autofocus placeholder="Search for apps and commands..." />
        <hr cmdk-raycast-loader="" />
        <Command.List ref={setListRef}>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions">
            <Item value="Linear" keywords={['issue', 'sprint']}>
              <Logo>
                <LinearIcon
                  style={{
                    width: '12px',
                    height: '12px',
                  }}
                />
              </Logo>
              Linear
            </Item>
            <Item value="Figma" keywords={['design', 'ui', 'ux']}>
              <Logo>
                <FigmaIcon />
              </Logo>
              Figma
            </Item>
            <Item value="Slack" keywords={['chat', 'team', 'communication']}>
              <Logo>
                <SlackIcon />
              </Logo>
              Slack
            </Item>
            <Item value="YouTube" keywords={['video', 'watch', 'stream']}>
              <Logo>
                <YouTubeIcon />
              </Logo>
              YouTube
            </Item>
            <Item value="Raycast" keywords={['productivity', 'tools', 'apps']}>
              <Logo>
                <RaycastIcon />
              </Logo>
              Raycast
            </Item>
          </Command.Group>
          <Command.Group heading="Commands">
            <Item isCommand value="Clipboard History" keywords={['copy', 'paste', 'clipboard']}>
              <Logo>
                <ClipboardIcon />
              </Logo>
              Clipboard History
            </Item>
            <Item isCommand value="Import Extension" keywords={['import', 'extension']}>
              <HammerIcon />
              Import Extension
            </Item>
            <Item isCommand value="Manage Extensions" keywords={['manage', 'extension']}>
              <HammerIcon />
              Manage Extensions
            </Item>
          </Command.Group>
        </Command.List>

        <div cmdk-raycast-footer="">
          <RaycastDarkIcon />

          <button cmdk-raycast-open-trigger="">
            Open Application
            <kbd>↵</kbd>
          </button>

          <hr />

          <SubCommand listRef={listRef()} inputRef={inputRef()} selectedValue={value()} />
        </div>
      </Command>
    </div>
  )
}

function Item({
  children,
  value,
  keywords,
  isCommand = false,
}: {
  children: JSX.Element
  value: string
  keywords?: string[]
  isCommand?: boolean
}) {
  return (
    <Command.Item value={value} keywords={keywords} onSelect={() => {}}>
      {children}
      <span cmdk-raycast-meta="">{isCommand ? 'Command' : 'Application'}</span>
    </Command.Item>
  )
}

function SubCommand(props: {
  inputRef: HTMLInputElement | null
  listRef: HTMLElement | null
  selectedValue: string
}) {
  const [open, setOpen] = createSignal(false)

  onMount(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        setOpen(o => !o)
      }
    }

    document.addEventListener('keydown', listener)

    onCleanup(() => {
      document.removeEventListener('keydown', listener)
    })
  })

  createEffect(() => {
    const el = props.listRef

    if (!el) return

    if (open()) {
      el.style.overflow = 'hidden'
    } else {
      el.style.overflow = ''
    }
  })

  return (
    <Popover.Root open={open()} onOpenChange={setOpen} placement="top-end" gutter={15}>
      <Popover.Anchor>
        <Popover.Trigger cmdk-raycast-subcommand-trigger="" aria-expanded={open()}>
          Actions
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </Popover.Trigger>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          class="raycast-submenu"
          onCloseAutoFocus={e => {
            //? Note: This doesn't appear to work
            e.preventDefault()
            props.inputRef?.focus()
          }}
        >
          <Command>
            <Command.List>
              <Command.Group heading={props.selectedValue}>
                <SubItem shortcut="↵">
                  <WindowIcon />
                  Open Application
                </SubItem>
                <SubItem shortcut="⌘ ↵">
                  <FinderIcon />
                  Show in Finder
                </SubItem>
                <SubItem shortcut="⌘ I">
                  <FinderIcon />
                  Show Info in Finder
                </SubItem>
                <SubItem shortcut="⌘ ⇧ F">
                  <StarIcon />
                  Add to Favorites
                </SubItem>
              </Command.Group>
            </Command.List>
            <Command.Input placeholder="Search for actions..." />
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function SubItem(props: { children: JSX.Element; shortcut: string }) {
  return (
    <Command.Item>
      {props.children}
      <div cmdk-raycast-submenu-shortcuts="">
        <For each={props.shortcut.split(' ')}>{key => <kbd>{key}</kbd>}</For>
      </div>
    </Command.Item>
  )
}

function RaycastDarkIcon() {
  return (
    <svg
      width="1024"
      height="1024"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M301.144 634.799V722.856L90 511.712L134.244 467.804L301.144 634.799ZM389.201 722.856H301.144L512.288 934L556.34 889.996L389.201 722.856ZM889.996 555.956L934 511.904L512.096 90L468.092 134.052L634.799 300.952H534.026L417.657 184.679L373.605 228.683L446.065 301.144H395.631V628.561H723.048V577.934L795.509 650.395L839.561 606.391L723.048 489.878V389.105L889.996 555.956ZM323.17 278.926L279.166 322.978L326.385 370.198L370.39 326.145L323.17 278.926ZM697.855 653.61L653.994 697.615L701.214 744.834L745.218 700.782L697.855 653.61ZM228.731 373.413L184.679 417.465L301.144 533.93V445.826L228.731 373.413ZM578.174 722.856H490.07L606.535 839.321L650.587 795.269L578.174 722.856Z"
        fill="#FF6363"
      />
    </svg>
  )
}

function WindowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.25 4.75V3.75C14.25 2.64543 13.3546 1.75 12.25 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V4.75M14.25 4.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H3.75C2.64543 14.25 1.75 13.3546 1.75 12.25V4.75M14.25 4.75H1.75"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

function FinderIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 4.75V6.25M11 4.75V6.25M8.75 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V12.25C1.75 13.3546 2.64543 14.25 3.75 14.25H8.75M8.75 1.75H12.25C13.3546 1.75 14.25 2.64543 14.25 3.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H8.75M8.75 1.75L7.08831 7.1505C6.9202 7.69686 7.32873 8.25 7.90037 8.25C8.36961 8.25 8.75 8.63039 8.75 9.09963V14.25M5 10.3203C5 10.3203 5.95605 11.25 8 11.25C10.0439 11.25 11 10.3203 11 10.3203"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.43376 2.17103C7.60585 1.60966 8.39415 1.60966 8.56624 2.17103L9.61978 5.60769C9.69652 5.85802 9.92611 6.02873 10.186 6.02873H13.6562C14.2231 6.02873 14.4665 6.75397 14.016 7.10088L11.1582 9.3015C10.9608 9.45349 10.8784 9.71341 10.9518 9.95262L12.0311 13.4735C12.2015 14.0292 11.5636 14.4777 11.1051 14.1246L8.35978 12.0106C8.14737 11.847 7.85263 11.847 7.64022 12.0106L4.89491 14.1246C4.43638 14.4777 3.79852 14.0292 3.96889 13.4735L5.04824 9.95262C5.12157 9.71341 5.03915 9.45349 4.84178 9.3015L1.98404 7.10088C1.53355 6.75397 1.77692 6.02873 2.34382 6.02873H5.81398C6.07389 6.02873 6.30348 5.85802 6.38022 5.60769L7.43376 2.17103Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

function ClipboardIcon() {
  return (
    <div cmdk-raycast-clipboard-icon="">
      <svg
        width="32"
        height="32"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.07512 2.75H4.75C3.64543 2.75 2.75 3.64543 2.75 4.75V12.25C2.75 13.3546 3.64543 14.25 4.75 14.25H11.25C12.3546 14.25 13.25 13.3546 13.25 12.25V4.75C13.25 3.64543 12.3546 2.75 11.25 2.75H9.92488M9.88579 3.02472L9.5934 4.04809C9.39014 4.75952 8.73989 5.25 8 5.25V5.25C7.26011 5.25 6.60986 4.75952 6.4066 4.04809L6.11421 3.02472C5.93169 2.38591 6.41135 1.75 7.07573 1.75H8.92427C9.58865 1.75 10.0683 2.3859 9.88579 3.02472Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  )
}

function HammerIcon() {
  return (
    <div cmdk-raycast-hammer-icon="">
      <svg
        width="32"
        height="32"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.73762 6.19288L2.0488 11.2217C1.6504 11.649 1.6504 12.3418 2.0488 12.769L3.13083 13.9295C3.52923 14.3568 4.17515 14.3568 4.57355 13.9295L9.26238 8.90071M6.73762 6.19288L7.0983 5.80605C7.4967 5.37877 7.4967 4.686 7.0983 4.25872L6.01627 3.09822L6.37694 2.71139C7.57213 1.42954 9.50991 1.42954 10.7051 2.71139L13.9512 6.19288C14.3496 6.62017 14.3496 7.31293 13.9512 7.74021L12.8692 8.90071C12.4708 9.328 11.8248 9.328 11.4265 8.90071L11.0658 8.51388C10.6674 8.0866 10.0215 8.0866 9.62306 8.51388L9.26238 8.90071M6.73762 6.19288L9.26238 8.90071"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  )
}
