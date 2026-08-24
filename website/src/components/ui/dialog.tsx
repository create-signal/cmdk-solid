import * as DialogPrimitive from '@kobalte/core/dialog'
import { XIcon } from '~/components/icons/lucide'
import { Component, ParentComponent } from 'solid-js'
import type { JSX } from '@solidjs/web'
import { cn } from '~/lib/utils'

type PartProps<T> = T extends (props: infer P) => unknown ? P : never

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.CloseButton

const DialogOverlay: ParentComponent<PartProps<typeof DialogPrimitive.Overlay>> = (props) => (
  <DialogPrimitive.Overlay
    {...props}
    class={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      props.class,
    )}
  />
)

const DialogContent: ParentComponent<PartProps<typeof DialogPrimitive.Content>> = (props) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      {...props}
      class={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        props.class,
      )}
    >
      {props.children}
      <DialogPrimitive.CloseButton class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <XIcon class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogPrimitive.CloseButton>
    </DialogPrimitive.Content>
  </DialogPortal>
)

const DialogHeader: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} class={cn('flex flex-col space-y-1.5 text-center sm:text-left', props.class)} />
)

const DialogFooter: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} class={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', props.class)} />
)

const DialogTitle: ParentComponent<PartProps<typeof DialogPrimitive.Title>> = (props) => (
  <DialogPrimitive.Title {...props} class={cn('text-lg font-semibold leading-none tracking-tight', props.class)} />
)

const DialogDescription: ParentComponent<PartProps<typeof DialogPrimitive.Description>> = (props) => (
  <DialogPrimitive.Description {...props} class={cn('text-sm text-muted-foreground', props.class)} />
)

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
