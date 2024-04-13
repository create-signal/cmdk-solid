import {
  Command as CommandPrimitive,
  CommandRootProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandSeparatorProps,
  CommandItemProps,
} from 'cmdk-solid'

import { cn } from '~/lib/utils'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Component, JSX, ParentComponent } from 'solid-js'
import { DialogRootProps } from '@kobalte/core/dist/types/dialog'
import { Search } from 'lucide-solid'

const Command: ParentComponent<CommandRootProps> = (props) => (
  <CommandPrimitive
    {...props}
    class={cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', props.class)}
  />
)

interface CommandDialogProps extends DialogRootProps {}

const CommandDialog: ParentComponent<CommandDialogProps> = (props) => {
  return (
    <Dialog {...props}>
      <DialogContent class="overflow-hidden p-0">
        <Command class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {props.children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput: Component<CommandInputProps> = (props) => (
  <div class="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      {...props}
      class={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )}
    />
  </div>
)

const CommandList: ParentComponent<CommandListProps> = (props) => (
  <CommandPrimitive.List {...props} class={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', props.class)} />
)

const CommandEmpty: ParentComponent<CommandEmptyProps> = (props) => (
  <CommandPrimitive.Empty {...props} class="py-6 text-center text-sm" />
)

const CommandGroup: ParentComponent<CommandGroupProps> = (props) => (
  <CommandPrimitive.Group
    {...props}
    class={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      props.class,
    )}
  />
)

const CommandSeparator: Component<CommandSeparatorProps> = (props) => (
  <CommandPrimitive.Separator {...props} class={cn('h-px bg-border', props.class)} />
)

const CommandItem: ParentComponent<CommandItemProps> = (props) => (
  <CommandPrimitive.Item
    {...props}
    class={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      props.class,
    )}
  />
)

const CommandShortcut: ParentComponent<JSX.HTMLAttributes<HTMLSpanElement>> = (props) => {
  return <span {...props} class={cn('ml-auto text-xs tracking-widest text-muted-foreground', props.class)} />
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
