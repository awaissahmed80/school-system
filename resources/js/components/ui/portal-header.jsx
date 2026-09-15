import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSpotlightSearch } from '@/components/ui/spotlight-search';
import { cn } from '@/lib/utils';
import { menuItems } from '@/utils/menu-items';

function resolveBreadcrumb(url) {
    const path = (url || '/').split('?')[0] || '/';

    if (path === '/' || path === '') {
        return { label: 'Dashboard', href: '/' };
    }

    for (const group of menuItems) {
        for (const item of group.items ?? []) {
            if (
                path === item.to ||
                (item.to !== '/' && path.startsWith(`${item.to}/`))
            ) {
                return { label: item.label, href: item.to };
            }
        }
    }

    const segment = path.split('/').filter(Boolean).pop() ?? 'Page';

    return {
        label: segment
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' '),
        href: path,
    };
}

function SessionSwitcher({ sessions, currentSession }) {
    const [selectedId, setSelectedId] = useState(
        currentSession?.id ?? sessions[0]?.id ?? null,
    );

    const selected =
        sessions.find((session) => session.id === selectedId) ??
        currentSession ??
        sessions[0];

    if (!selected) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    'inline-flex h-9 max-w-56 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none',
                    'hover:bg-card focus-visible:ring-2 focus-visible:ring-ring',
                )}
            >
                <Icon
                    name="calendar-2-line"
                    className="text-base text-muted-foreground"
                />
                <span className="truncate">
                    Session: {selected.label}
                </span>
                <Icon
                    name="arrow-down-s-line"
                    className="ml-auto text-base text-muted-foreground"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
                {sessions.map((session) => (
                    <DropdownMenuItem
                        key={session.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedId(session.id)}
                    >
                        <span className="flex-1">{session.label}</span>
                        {session.id === selected.id ? (
                            <Icon
                                name="check-line"
                                className="text-primary"
                            />
                        ) : null}
                        {session.is_active ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                                Active
                            </span>
                        ) : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function PortalHeader({ className }) {
    const { url, academicSession } = usePage().props;
    const { openSpotlight } = useSpotlightSearch();
    const crumb = useMemo(() => resolveBreadcrumb(url), [url]);
    const sessions = academicSession?.options ?? [
        { id: '2026-2027', label: '2026-2027', is_active: true },
    ];
    const currentSession = academicSession?.current ?? sessions[0];

    return (
        <header
            className={cn(
                'sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6',
                className,
            )}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger className="size-8 shrink-0 text-muted-foreground hover:text-foreground" />

                <nav
                    aria-label="Breadcrumb"
                    className="flex min-w-0 items-center gap-1.5 text-sm"
                >
                    <Link
                        href="/"
                        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                        aria-label="Home"
                    >
                        <Icon name="home-4-line" className="text-lg" />
                    </Link>
                    <Icon
                        name="arrow-right-s-line"
                        className="text-base text-muted-foreground/70"
                    />
                    <span className="truncate font-medium text-foreground">
                        {crumb.label}
                    </span>
                </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <SessionSwitcher
                    sessions={sessions}
                    currentSession={currentSession}
                />

                <button
                    type="button"
                    onClick={openSpotlight}
                    className={cn(
                        'hidden h-9 w-56 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm text-muted-foreground outline-none md:inline-flex lg:w-72',
                        'hover:bg-card focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                    aria-label="Spotlight search"
                >
                    <Icon name="search-line" className="text-base" />
                    <span className="min-w-0 flex-1 truncate">
                        Spotlight search...
                    </span>
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        ⌘K
                    </kbd>
                </button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9 md:hidden"
                    aria-label="Search"
                    onClick={openSpotlight}
                >
                    <Icon name="search-line" className="text-lg" />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9"
                    aria-label="Help"
                >
                    <Icon name="question-line" className="text-lg" />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="relative size-9"
                    aria-label="Notifications"
                >
                    <Icon name="notification-3-line" className="text-lg" />
                    <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-secondary" />
                </Button>
            </div>
        </header>
    );
}
