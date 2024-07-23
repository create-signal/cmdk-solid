import { Command } from 'cmdk-solid'
import { For, createSignal } from 'solid-js'

type NavElement = {
  title: string
  href: string
  external?: boolean
  status?: 'new' | 'updated'
}

type NavCategory = {
  title: string
  items: NavElement[]
}

const Page = () => {
  const [search, setSearch] = createSignal('')
  const config: NavCategory[] = [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs/introduction',
        },
        {
          title: 'Installation',
          href: '/docs/installation/overview',
        },
        {
          title: 'Dark Mode',
          href: '/docs/dark-mode/overview',
        },
        {
          title: 'CLI',
          href: '/docs/cli',
        },
        {
          title: 'Figma',
          href: '/docs/figma',
        },
        {
          title: 'About',
          href: '/docs/about',
        },
      ],
    },
    {
      title: 'Visualizations',
      items: [
        {
          title: 'Bar List',
          href: '/docs/components/bar-list',
          status: 'new',
        },
        {
          title: 'Charts',
          href: '/docs/components/charts',
        },
        {
          title: 'Delta Bar',
          href: '/docs/components/delta-bar',
        },
        {
          title: 'Progress',
          href: '/docs/components/progress',
        },
        {
          title: 'Progress Circle',
          href: '/docs/components/progress-circle',
        },
      ],
    },
    {
      title: 'UI',
      items: [
        {
          title: 'Accordion',
          href: '/docs/components/accordion',
        },
        {
          title: 'Alert',
          href: '/docs/components/alert',
        },
        {
          title: 'Alert Dialog',
          href: '/docs/components/alert-dialog',
        },
        {
          title: 'Aspect Ratio',
          href: '/docs/components/aspect-ratio',
          status: 'new',
        },
        {
          title: 'Avatar',
          href: '/docs/components/avatar',
        },
        {
          title: 'Badge',
          href: '/docs/components/badge',
        },
        {
          title: 'Badge Delta',
          href: '/docs/components/badge-delta',
        },
        {
          title: 'Breadcrumb',
          href: '/docs/components/breadcrumb',
          status: 'new',
        },
        {
          title: 'Button',
          href: '/docs/components/button',
        },
        {
          title: 'Callout',
          href: '/docs/components/callout',
        },
        {
          title: 'Card',
          href: '/docs/components/card',
        },
        {
          title: 'Carousel',
          href: '/docs/components/carousel',
        },
        {
          title: 'Checkbox',
          href: '/docs/components/checkbox',
        },
        {
          title: 'Collapsible',
          href: '/docs/components/collapsible',
        },
        {
          title: 'Combobox',
          href: '/docs/components/combobox',
        },
        {
          title: 'Command',
          href: '/docs/components/command',
        },
        {
          title: 'Context Menu',
          href: '/docs/components/context-menu',
        },
        {
          title: 'Dialog',
          href: '/docs/components/dialog',
        },
        {
          title: 'Drawer',
          href: '/docs/components/drawer',
        },
        {
          title: 'Dropdown Menu',
          href: '/docs/components/dropdown-menu',
        },
        {
          title: 'Hover Card',
          href: '/docs/components/hover-card',
        },
        {
          title: 'Label',
          href: '/docs/components/label',
        },
        {
          title: 'Menubar',
          href: '/docs/components/menubar',
        },
        {
          title: 'Navigation Menu',
          href: '/docs/components/navigation-menu',
          status: 'new',
        },
        {
          title: 'Number Field',
          href: '/docs/components/number-field',
        },
        {
          title: 'OTP Field',
          href: '/docs/components/otp-field',
          status: 'new',
        },
        {
          title: 'Pagination',
          href: '/docs/components/pagination',
        },
        {
          title: 'Popover',
          href: '/docs/components/popover',
        },
        {
          title: 'Radio Group',
          href: '/docs/components/radio-group',
        },
        {
          title: 'Resizable',
          href: '/docs/components/resizable',
        },
        {
          title: 'Select',
          href: '/docs/components/select',
        },
        {
          title: 'Separator',
          href: '/docs/components/separator',
        },
        {
          title: 'Sheet',
          href: '/docs/components/sheet',
        },
        {
          title: 'Skeleton',
          href: '/docs/components/skeleton',
        },
        {
          title: 'Slider',
          href: '/docs/components/slider',
        },
        {
          title: 'Switch',
          href: '/docs/components/switch',
          status: 'updated',
        },
        {
          title: 'Table',
          href: '/docs/components/table',
        },
        {
          title: 'Tabs',
          href: '/docs/components/tabs',
        },
        {
          title: 'Text Field',
          href: '/docs/components/text-field',
          status: 'new',
        },
        {
          title: 'Timeline',
          href: '/docs/components/timeline',
        },
        {
          title: 'Toast',
          href: '/docs/components/toast',
        },
        {
          title: 'Toggle',
          href: '/docs/components/toggle',
        },
        {
          title: 'Toggle Group',
          href: '/docs/components/toggle-group',
        },
        {
          title: 'Tooltip',
          href: '/docs/components/tooltip',
        },
      ],
    },
    {
      title: 'Layout',
      items: [
        {
          title: 'Flex',
          href: '/docs/components/flex',
        },
        {
          title: 'Grid',
          href: '/docs/components/grid',
        },
      ],
    },
  ]

  return (
    <div>
      <Command>
        <Command.Input placeholder="Search…" value={search()} onValueChange={setSearch} />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>
          <For each={config}>
            {(category) => (
              <Command.Group heading={category.title}>
                <For each={category.items}>{(item) => <Command.Item>{item.title}</Command.Item>}</For>
              </Command.Group>
            )}
          </For>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
