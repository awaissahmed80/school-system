import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { cn } from 'cn';
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    SearchIcon,
} from 'lucide-react';

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }) {
    return (
        <SelectPrimitive.Group
            data-slot="select-group"
            className={cn('scroll-my-1 p-1', className)}
            {...props}
        />
    );
}

function SelectValue({ className, ...props }) {
    return (
        <SelectPrimitive.Value
            data-slot="select-value"
            className={cn('flex flex-1 text-left', className)}
            {...props}
        />
    );
}

function SelectTrigger({
    className,
    size = 'default',
    children,
    ...props
}) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                "flex w-full items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-base whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 dark:bg-input/20 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon
                render={
                    <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
                }
            />
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
    className,
    children,
    side = 'bottom',
    sideOffset = 4,
    align = 'center',
    alignOffset = 0,
    alignItemWithTrigger = true,
    ...props
}) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                alignItemWithTrigger={alignItemWithTrigger}
                className="isolate z-50"
            >
                <SelectPrimitive.Popup
                    data-slot="select-content"
                    data-align-trigger={alignItemWithTrigger}
                    className={cn(
                        'relative isolate z-50 flex max-h-60 w-(--anchor-width) min-w-36 origin-(--transform-origin) flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    );
}

function SelectFilter({
    className,
    value,
    onValueChange,
    placeholder = 'Filter…',
    ...props
}) {
    return (
        <div
            data-slot="select-filter"
            className="sticky top-0 z-10 border-b border-border bg-popover p-1.5"
        >
            <div className="flex h-8 items-center gap-2 rounded-md border border-input/40 bg-input/20 px-2">
                <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                    data-slot="select-filter-input"
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className={cn(
                        'h-full min-w-0 grow bg-transparent text-sm outline-none placeholder:text-muted-foreground',
                        className,
                    )}
                    onChange={(event) => onValueChange?.(event.target.value)}
                    onKeyDown={(event) => {
                        // Keep typing in the filter; don't let Select typeahead steal keys.
                        event.stopPropagation();

                        if (event.key === 'Escape') {
                            return;
                        }

                        if (
                            event.key === 'ArrowDown' ||
                            event.key === 'ArrowUp' ||
                            event.key === 'Enter' ||
                            event.key === 'Home' ||
                            event.key === 'End'
                        ) {
                            return;
                        }
                    }}
                    onClick={(event) => event.stopPropagation()}
                    {...props}
                />
            </div>
        </div>
    );
}

function SelectList({ className, children, ...props }) {
    return (
        <div className="relative min-h-0 flex-1 overflow-y-auto">
            <SelectScrollUpButton />
            <SelectPrimitive.List
                data-slot="select-list"
                className={cn('p-1', className)}
                {...props}
            >
                {children}
            </SelectPrimitive.List>
            <SelectScrollDownButton />
        </div>
    );
}

function SelectEmpty({ className, children = 'No results found.', ...props }) {
    return (
        <div
            data-slot="select-empty"
            className={cn(
                'px-2 py-6 text-center text-sm text-muted-foreground',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function SelectLabel({ className, ...props }) {
    return (
        <SelectPrimitive.GroupLabel
            data-slot="select-label"
            className={cn('px-1.5 py-1 text-xs text-muted-foreground', className)}
            {...props}
        />
    );
}

function SelectItem({ className, children, ...props }) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <SelectPrimitive.ItemText className="flex min-w-0 flex-1 gap-2 truncate">
                {children}
            </SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                <CheckIcon className="pointer-events-none size-4" />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
}

function SelectSeparator({ className, ...props }) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(
                'pointer-events-none -mx-1 my-1 h-px bg-border',
                className,
            )}
            {...props}
        />
    );
}

function SelectScrollUpButton({ className, ...props }) {
    return (
        <SelectPrimitive.ScrollUpArrow
            data-slot="select-scroll-up-button"
            className={cn(
                "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <ChevronUpIcon />
        </SelectPrimitive.ScrollUpArrow>
    );
}

function SelectScrollDownButton({ className, ...props }) {
    return (
        <SelectPrimitive.ScrollDownArrow
            data-slot="select-scroll-down-button"
            className={cn(
                "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <ChevronDownIcon />
        </SelectPrimitive.ScrollDownArrow>
    );
}

export {
    Select,
    SelectContent,
    SelectEmpty,
    SelectFilter,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectList,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
