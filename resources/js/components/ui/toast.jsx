import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { XIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const toastManager = ToastPrimitive.createToastManager()

function createTypedToast(type) {
  return (message, options = {}) => {
    if (typeof message === "object" && message !== null) {
      return toastManager.add({
        type,
        title: message.title,
        description: message.description,
        ...options,
      })
    }

    return toastManager.add({
      type,
      title: message,
      ...options,
    })
  }
}

const toast = Object.assign(toastManager, {
  success: createTypedToast("success"),
  error: createTypedToast("error"),
  info: createTypedToast("info"),
  warning: createTypedToast("warning"),
  loading: createTypedToast("loading"),
})

function ToastProvider({
  ...props
}) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal({
  ...props
}) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({
  className,
  position = "top-center",
  ...props
}) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      data-position={position}
      className={cn(
        "pointer-events-none fixed z-50 mx-auto w-[calc(100vw-2rem)] max-w-sm outline-none",
        position === "top-center" && "inset-x-0 top-4",
        position === "top-right" && "top-4 right-4 left-auto mx-0",
        position === "top-left" && "top-4 left-4 right-auto mx-0",
        position === "bottom-center" && "inset-x-0 bottom-4",
        position === "bottom-right" && "right-4 bottom-4 left-auto mx-0",
        position === "bottom-left" && "bottom-4 left-4 right-auto mx-0",
        className
      )}
      {...props} />
  );
}

function Toast({
  className,
  position = "top-center",
  richColors = false,
  swipeDirection,
  ...props
}) {
  const isTop = position.startsWith("top")

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-rich-colors={richColors ? "true" : undefined}
      swipeDirection={swipeDirection ?? (isTop ? ["up", "left", "right"] : ["down", "left", "right"])}
      className={cn(
        "group/toast pointer-events-auto absolute z-[calc(1000-var(--toast-index))] w-full rounded-xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "data-limited:opacity-0 data-expanded:h-(--toast-height)",
        isTop
          ? [
              "top-0 bottom-auto origin-top",
              "[--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
              "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]",
              "after:absolute after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
              "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
              "data-starting-style:[transform:translateY(-150%)]",
              "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]",
            ]
          : [
              "right-0 bottom-0 origin-bottom",
              "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
              "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
              "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
              "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
              "data-starting-style:[transform:translateY(150%)]",
              "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
            ],
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        richColors && [
          "data-[type=success]:border-success/25 data-[type=success]:bg-success-muted data-[type=success]:text-success-muted-foreground",
          "data-[type=error]:border-destructive/30 data-[type=error]:bg-destructive/15 data-[type=error]:text-destructive",
          "data-[type=warning]:border-secondary/35 data-[type=warning]:bg-secondary/15 data-[type=warning]:text-secondary",
          "data-[type=info]:border-primary/30 data-[type=info]:bg-primary/10 data-[type=info]:text-primary",
          "data-[type=loading]:border-border data-[type=loading]:bg-muted data-[type=loading]:text-foreground",
        ],
        className
      )}
      {...props} />
  );
}

function ToastContent({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props} />
  );
}

function ToastTitle({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium", className)}
      {...props} />
  );
}

function ToastDescription({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        "text-sm opacity-90 group-data-[rich-colors=true]/toast:text-current",
        !className && "text-muted-foreground group-data-[rich-colors=true]/toast:opacity-90",
        className
      )}
      {...props} />
  );
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props} />
  );
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 opacity-70 after:absolute after:-inset-2 after:content-[''] hover:opacity-100 group-data-[rich-colors=true]/toast:text-current",
        className
      )}
      {...props}>
      {children ?? (
        <XIcon aria-hidden="true" />
      )}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({
  type,
  richColors = false,
}) {
  let icon = null

  if (type === "success") {
    icon = (
      <CircleCheckIcon
        className={richColors ? "text-success" : undefined}
        aria-hidden="true" />
    )
  }

  if (type === "info") {
    icon = (
      <InfoIcon
        className={richColors ? "text-primary" : undefined}
        aria-hidden="true" />
    )
  }

  if (type === "warning") {
    icon = (
      <TriangleAlertIcon
        className={richColors ? "text-secondary" : undefined}
        aria-hidden="true" />
    )
  }

  if (type === "error") {
    icon = (
      <OctagonXIcon
        className="text-destructive"
        aria-hidden="true" />
    )
  }

  if (type === "loading") {
    icon = (
      <Loader2Icon className="animate-spin" aria-hidden="true" />
    )
  }

  if (!icon) {
    return null
  }

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
      {icon}
    </span>
  );
}

function ToastList({
  position = "top-center",
  richColors = false,
}) {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast
      key={toastItem.id}
      toast={toastItem}
      position={position}
      richColors={richColors}>
      <ToastContent>
        <ToastIcon type={toastItem.type} richColors={richColors} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastTitle />
          <ToastDescription />
        </div>
        {toastItem.actionProps ? <ToastAction /> : null}
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({
  children,
  toastManager: manager = toast,
  position = "top-center",
  richColors = true,
  ...props
}) {
  return (
    <ToastProvider toastManager={manager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport position={position}>
          <ToastList position={position} richColors={richColors} />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
}
