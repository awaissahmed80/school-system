import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { router } from '@inertiajs/react';
import { Autocomplete } from '@base-ui/react/autocomplete';
import { Dialog } from '@base-ui/react/dialog';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { menuItems } from '@/utils/menu-items';

const SpotlightSearchContext = createContext(null);

const SUGGESTION_IDS = [
    'dashboard',
    'admissions',
    'student-attendance',
    'fees',
    'users-roles',
    'settings',
];

function toSearchItem(item, groupTitle) {
    return {
        value: item.id,
        label: item.label,
        href: item.to,
        icon: item.icon,
        group: groupTitle,
        keywords: [item.label, groupTitle, item.to].join(' '),
    };
}

function buildSpotlightGroups() {
    const flatItems = menuItems.flatMap((group) =>
        (group.items ?? []).map((item) => toSearchItem(item, group.title)),
    );

    const byId = new Map(flatItems.map((item) => [item.value, item]));

    const suggestions = SUGGESTION_IDS.map((id) => byId.get(id)).filter(
        Boolean,
    );

    return [
        {
            value: 'Suggestions',
            items: suggestions,
        },
        ...menuItems.map((group) => ({
            value: group.title,
            items: (group.items ?? []).map((item) =>
                toSearchItem(item, group.title),
            ),
        })),
    ].filter((group) => group.items.length > 0);
}

function filterSpotlightItem(item, query) {
    const normalized = query.trim().toLocaleLowerCase();

    if (!normalized) {
        return true;
    }

    const haystack = `${item.label} ${item.group} ${item.keywords} ${item.href}`
        .toLocaleLowerCase();

    return haystack.includes(normalized);
}

export function useSpotlightSearch() {
    const context = useContext(SpotlightSearchContext);

    if (!context) {
        throw new Error(
            'useSpotlightSearch must be used within SpotlightSearchProvider.',
        );
    }

    return context;
}

export function SpotlightSearchProvider({ children }) {
    const [open, setOpen] = useState(false);

    const openSpotlight = useCallback(() => setOpen(true), []);
    const closeSpotlight = useCallback(() => setOpen(false), []);

    useEffect(() => {
        const onKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen((current) => !current);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const value = useMemo(
        () => ({
            open,
            setOpen,
            openSpotlight,
            closeSpotlight,
        }),
        [open, openSpotlight, closeSpotlight],
    );

    return (
        <SpotlightSearchContext.Provider value={value}>
            {children}
            <SpotlightSearch open={open} onOpenChange={setOpen} />
        </SpotlightSearchContext.Provider>
    );
}

export function SpotlightSearch({ open, onOpenChange }) {
    const shortcutsDescriptionId = useId();
    const groups = useMemo(() => buildSpotlightGroups(), []);
    const [query, setQuery] = useState('');
    const highlightedRef = useRef(null);

    useEffect(() => {
        if (!open) {
            setQuery('');
            highlightedRef.current = null;
        }
    }, [open]);

    const selectItem = useCallback(
        (item) => {
            if (!item?.href) {
                return;
            }

            onOpenChange(false);
            router.visit(item.href);
        },
        [onOpenChange],
    );

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Backdrop
                    className={cn(
                        'fixed inset-0 z-50 bg-black/40 transition-opacity duration-150',
                        'supports-backdrop-filter:backdrop-blur-xs',
                        'data-starting-style:opacity-0 data-ending-style:opacity-0',
                        'dark:bg-black/70',
                    )}
                />
                <Dialog.Viewport className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden px-4 pt-[12vh] pb-6">
                    <Dialog.Popup
                        className={cn(
                            'relative flex max-h-[min(36rem,calc(100dvh-6rem))] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl outline-none',
                            'transition-[translate,scale,opacity] duration-150',
                            'data-starting-style:-translate-y-3 data-starting-style:scale-95 data-starting-style:opacity-0',
                            'data-ending-style:-translate-y-3 data-ending-style:scale-95 data-ending-style:opacity-0',
                        )}
                        aria-label="Spotlight search"
                    >
                        <Dialog.Title className="sr-only">
                            Spotlight search
                        </Dialog.Title>
                        <Dialog.Description className="sr-only">
                            Search pages and modules across the school portal.
                        </Dialog.Description>

                        <Autocomplete.Root
                            open
                            inline
                            items={groups}
                            value={query}
                            onValueChange={setQuery}
                            filter={filterSpotlightItem}
                            autoHighlight="always"
                            keepHighlight
                            onItemHighlighted={(item) => {
                                highlightedRef.current = item ?? null;
                            }}
                        >
                            <Autocomplete.InputGroup className="flex items-center gap-3 border-b border-border px-4">
                                <Icon
                                    name="search-line"
                                    className="text-xl text-muted-foreground"
                                    aria-hidden
                                />
                                <Autocomplete.Input
                                    className={cn(
                                        'h-14 w-full border-0 bg-transparent text-base text-foreground outline-none',
                                        'placeholder:text-muted-foreground',
                                    )}
                                    placeholder="Start searching"
                                    aria-label="Search the portal"
                                    aria-describedby={shortcutsDescriptionId}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' &&
                                            highlightedRef.current
                                        ) {
                                            event.preventDefault();
                                            selectItem(highlightedRef.current);
                                        }
                                    }}
                                />
                                <Dialog.Close
                                    className={cn(
                                        'inline-flex h-7 items-center rounded-md border border-border bg-muted px-2 text-[11px] font-medium text-muted-foreground outline-none',
                                        'hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                                    )}
                                >
                                    Esc
                                </Dialog.Close>
                            </Autocomplete.InputGroup>

                            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
                                <Autocomplete.Empty className="text-sm text-muted-foreground">
                                    <div className="px-3 py-10 text-center">
                                        No results for “{query}”.
                                    </div>
                                </Autocomplete.Empty>

                                <Autocomplete.List className="outline-none">
                                    {(group) => (
                                        <Autocomplete.Group
                                            key={group.value}
                                            items={group.items}
                                            className="not-last:mb-2"
                                        >
                                            <Autocomplete.GroupLabel className="px-3 pt-1.5 pb-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                                                {group.value}
                                            </Autocomplete.GroupLabel>
                                            <Autocomplete.Collection>
                                                {(item) => (
                                                    <Autocomplete.Item
                                                        key={item.value}
                                                        value={item}
                                                        onClick={() =>
                                                            selectItem(item)
                                                        }
                                                        className={cn(
                                                            'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none select-none',
                                                            'data-highlighted:bg-primary/10 data-highlighted:text-primary',
                                                        )}
                                                    >
                                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground group-data-highlighted/item:bg-primary/15 group-data-highlighted/item:text-primary">
                                                            <Icon
                                                                name={item.icon}
                                                                className="text-lg"
                                                            />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block truncate font-medium text-foreground group-data-highlighted/item:text-primary">
                                                                {item.label}
                                                            </span>
                                                            <span className="block truncate text-xs text-muted-foreground">
                                                                {item.group}
                                                                {' · '}
                                                                {item.href === '/'
                                                                    ? 'Dashboard'
                                                                    : item.href}
                                                            </span>
                                                        </span>
                                                        <Icon
                                                            name="arrow-right-up-line"
                                                            className="text-base text-muted-foreground opacity-0 group-data-highlighted/item:opacity-100"
                                                        />
                                                    </Autocomplete.Item>
                                                )}
                                            </Autocomplete.Collection>
                                        </Autocomplete.Group>
                                    )}
                                </Autocomplete.List>
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
                                <span
                                    id={shortcutsDescriptionId}
                                    className="sr-only"
                                >
                                    Use arrow keys to move, Enter to open a
                                    result, and Escape to close.
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center gap-1.5">
                                        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
                                            ↑↓
                                        </kbd>
                                        Navigate
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
                                            ↵
                                        </kbd>
                                        Open
                                    </span>
                                </div>
                                <span className="hidden sm:inline">
                                    Search modules across the portal
                                </span>
                            </div>
                        </Autocomplete.Root>
                    </Dialog.Popup>
                </Dialog.Viewport>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
