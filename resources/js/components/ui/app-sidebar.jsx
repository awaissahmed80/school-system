import { usePage } from '@inertiajs/react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Icon } from '@/components/ui/icon';
import { NavLink } from '@/components/ui/nav-link';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserMenu } from '@/components/ui/user-menu';
import { cn } from '@/lib/utils';
import { menuItems } from '@/utils/menu-items';

function isItemActive(url, item) {
    const path = url.split('?')[0] || '/';

    if (item.end || item.to === '/') {
        return path === '/' || path === '';
    }

    return path === item.to || path.startsWith(`${item.to}/`);
}

function groupHasActiveItem(url, group) {
    return group.items?.some((item) => isItemActive(url, item)) ?? false;
}

function SidebarMenuGroup({ group, url }) {
    const hasActiveItem = groupHasActiveItem(url, group);
    const defaultOpen = group.defaultOpen === true || hasActiveItem;

    return (
        <Collapsible defaultOpen={defaultOpen}>
            <SidebarGroup className="p-0">
                <CollapsibleTrigger
                    className={cn(
                        'group/trigger flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left outline-none',
                        'text-xs font-semibold tracking-wide text-sidebar-foreground/70 uppercase',
                        'transition-colors hover:bg-card hover:text-sidebar-foreground',
                        'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                        hasActiveItem && 'text-primary',
                    )}
                >
                    <span className="min-w-0 flex-1 truncate">{group.title}</span>
                    <Icon
                        name="arrow-down-s-line"
                        className="text-base transition-transform duration-200 group-data-panel-open/trigger:rotate-180"
                    />
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarGroupContent className="pt-1">
                        <SidebarMenu className="gap-0.5">
                            {group.items?.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <NavLink
                                        href={item.to}
                                        end={item.end || item.to === '/'}
                                        className="flex flex-row items-center rounded-md px-3 py-1.5 text-sm font-medium hover:bg-card"
                                    >
                                        <Icon
                                            name={item.icon}
                                            className="w-8 text-lg"
                                        />
                                        {item.label}
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

export function AppSidebar() {
    const { url } = usePage();

    return (
        <Sidebar
            collapsible="offcanvas"
            variant="sidebar"
            className="flex h-screen flex-col overflow-hidden p-0!"
        >
            <SidebarHeader className="border-b-0 px-5 py-5 items-start">
                <img
                    className="h-8"
                    src="/images/axiom-logo.svg"
                    alt="Axiom School"
                />
            </SidebarHeader>

            <SidebarContent className="relative min-h-0 flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full custom-scrollbar" >
                    <nav className="space-y-3 p-4" aria-label="Portal">
                        {menuItems.map((group) => (
                            <SidebarMenuGroup
                                key={group.id}
                                group={group}
                                url={url}
                            />
                        ))}
                    </nav>
                </ScrollArea>
            </SidebarContent>

            <SidebarFooter className="p-3">
                <UserMenu />
            </SidebarFooter>
        </Sidebar>
    );
}
