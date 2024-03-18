import {
  Code,
  CopiedIcon,
  CopyIcon,
  FramerCMDK,
  FramerIcon,
  GitHubIcon,
  LinearCMDK,
  LinearIcon,
  RaycastCMDK,
  RaycastIcon,
  ShadcnIcon,
  VercelCMDK,
  VercelIcon,
  ShadcnCMDK,
} from '../components'
import { Motion, MotionComponentProps } from 'solid-motionone'
import { Accessor, JSX, createContext, createEffect, createSignal, onCleanup, onMount, useContext } from 'solid-js'
import packageJSON from '../../../cmdk/package.json'
import styles from '../styles/index.module.scss'
import { For, Show } from 'solid-js/web'
import { createVisibilityObserver } from '@solid-primitives/intersection-observer'

type TTheme = {
  theme: Accessor<Themes>
  setTheme: Function
}

type Themes = 'linear' | 'raycast' | 'vercel' | 'framer' | 'shadcn/ui'

const ThemeContext = createContext<TTheme>({} as TTheme)

export default function Index() {
  const [theme, setTheme] = createSignal<Themes>('linear')

  return (
    <main class={styles.main}>
      <div class={styles.content}>
        <div class={styles.meta}>
          <div class={styles.info}>
            <VersionBadge />
            <h1>⌘K</h1>
            <p>
              Fast, composable, unstyled command menu for SolidJS, Ported from{' '}
              <a href="https://github.com/pacocoursey/cmdk" target="_blank">
                @pacocoursey's ⌘K for React.
              </a>
            </p>
          </div>

          <div class={styles.buttons}>
            <InstallButton />
            <GitHubButton />
          </div>
        </div>

        <Show when={theme() === 'framer'}>
          <CMDKWrapper>
            <FramerCMDK />
          </CMDKWrapper>
        </Show>
        <Show when={theme() === 'linear'}>
          <CMDKWrapper>
            <LinearCMDK />
          </CMDKWrapper>
        </Show>
        <Show when={theme() === 'raycast'}>
          {' '}
          <CMDKWrapper>
            <RaycastCMDK />
          </CMDKWrapper>
        </Show>
        <Show when={theme() === 'vercel'}>
          <CMDKWrapper>
            <VercelCMDK />
          </CMDKWrapper>
        </Show>
        <Show when={theme() === 'shadcn/ui'}>
          <CMDKWrapper>
            <ShadcnCMDK />
          </CMDKWrapper>
        </Show>

        <ThemeContext.Provider value={{ theme, setTheme }}>
          <ThemeSwitcher />
        </ThemeContext.Provider>

        <div aria-hidden class={styles.line} />

        <Codeblock />
      </div>
      <Footer />
    </main>
  )
}

function CMDKWrapper(props: MotionComponentProps & { children: JSX.Element }) {
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        height: '475px',
      }}
      {...props}
    />
  )
}

function InstallButton() {
  const [copied, setCopied] = createSignal(false)

  return (
    <button
      class={styles.installButton}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`npm install cmdk-solid`)
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 2000)
        } catch (e) {}
      }}
    >
      npm install cmdk-solid
      <span>
        <Show when={copied()} fallback={<CopyIcon />}>
          <CopiedIcon />
        </Show>
      </span>
    </button>
  )
}

function GitHubButton() {
  return (
    <a
      href="https://github.com/create-signal/cmdk-solid"
      target="_blank"
      rel="noopener noreferrer"
      class={styles.githubButton}
    >
      <GitHubIcon />
      create-signal/cmdk-solid
    </a>
  )
}

function VersionBadge() {
  return <span class={styles.versionBadge}>v{packageJSON.version}</span>
}

const themes = [
  {
    icon: RaycastIcon,
    key: 'raycast',
  },
  {
    icon: LinearIcon,
    key: 'linear',
  },
  {
    icon: VercelIcon,
    key: 'vercel',
  },
  {
    icon: FramerIcon,
    key: 'framer',
  },
  {
    icon: ShadcnIcon,
    key: 'shadcn/ui',
  },
]

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext)
  const [showArrowKeyHint, setShowArrowKeyHint] = createSignal(false)

  onMount(() => {
    function listener(e: KeyboardEvent) {
      const themeNames = themes.map((t) => t.key)

      if (e.key === 'ArrowRight') {
        const currentIndex = themeNames.indexOf(theme())
        const nextIndex = currentIndex + 1
        const nextItem = themeNames[nextIndex]

        if (nextItem) {
          setTheme(nextItem)
        }
      }

      if (e.key === 'ArrowLeft') {
        const currentIndex = themeNames.indexOf(theme())
        const prevIndex = currentIndex - 1
        const prevItem = themeNames[prevIndex]

        if (prevItem) {
          setTheme(prevItem)
        }
      }
    }

    document.addEventListener('keydown', listener)

    onCleanup(() => {
      document.removeEventListener('keydown', listener)
    })
  })

  return (
    <div class={styles.switcher}>
      <span class={styles.arrow}>←</span>
      <For each={themes}>
        {({ key, icon }) => {
          const isActive = () => theme() === key
          return (
            <button
              data-selected={isActive()}
              onClick={() => {
                setTheme(key)
                if (showArrowKeyHint() === false) {
                  setShowArrowKeyHint(true)
                }
              }}
            >
              {icon({})}
              {key}

              <Show when={isActive()}>
                <div class={styles.activeTheme} />
              </Show>
            </button>
          )
        }}
      </For>
      <span
        class={styles.arrow}
        style={{
          right: '0px',
        }}
      >
        →
      </span>
    </div>
  )
}

function Codeblock() {
  const code = `import { Command } from 'cmdk-solid';

<Command.Dialog open={open()} onOpenChange={setOpen}>
  <Command.Input />

  <Command.List>
    <Show when={loading()}>
      <Command.Loading>Hang on…</Command.Loading>
    </Show>

    <Command.Empty>No results found.</Command.Empty>

    <Command.Group heading="Fruits">
      <Command.Item>Apple</Command.Item>
      <Command.Item>Orange</Command.Item>
      <Command.Separator />
      <Command.Item>Pear</Command.Item>
      <Command.Item>Blueberry</Command.Item>
    </Command.Group>

    <Command.Item>Fish</Command.Item>
  </Command.List>
</Command.Dialog>`

  return (
    <div class={styles.codeBlock}>
      <div class={styles.line2} aria-hidden />
      <div class={styles.line3} aria-hidden />
      <Code>{code}</Code>
    </div>
  )
}

function Footer() {
  let el: HTMLDivElement | undefined
  const visibilityState = createVisibilityObserver({ rootMargin: '100px' })(() => el)
  const [visible, setVisible] = createSignal(false)

  createEffect(() => {
    if (visibilityState()) {
      setVisible(true)
    }
  })

  return (
    <>
      <footer ref={el} class={styles.footer} data-animate={visible()}>
        <div class={styles.footerText}>
          Crafted by{' '}
          <a href="https://github.com/create-signal" target="_blank" rel="noopener noreferrer">
            <img src="/paco.png" alt="Avatar of Kiz" />
            Kieran
          </a>
          ,{' '}
          <a href="https://paco.me" target="_blank" rel="noopener noreferrer">
            <img src="/paco.png" alt="Avatar of Paco" />
            Paco
          </a>{' '}
          and{' '}
          <a href="https://rauno.me" target="_blank" rel="noopener noreferrer">
            <img src="/rauno.jpeg" alt="Avatar of Rauno" />
            Rauno
          </a>
        </div>
      </footer>
    </>
  )
}
