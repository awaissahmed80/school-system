import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { cn } from '@/lib/utils';

function Collapsible({ ...props }) {
    return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ className, ...props }) {
    return (
        <CollapsiblePrimitive.Trigger
            data-slot="collapsible-trigger"
            className={cn(className)}
            {...props}
        />
    );
}

function CollapsibleContent({ className, ...props }) {
    return (
        <CollapsiblePrimitive.Panel
            data-slot="collapsible-content"
            className={cn(
                'flex h-(--collapsible-panel-height) flex-col overflow-hidden transition-[height] duration-200 ease-out',
                'data-ending-style:h-0 data-starting-style:h-0',
                "[&[hidden]:not([hidden='until-found'])]:hidden",
                className,
            )}
            {...props}
        />
    );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
