import { router, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { cn } from '@/lib/utils';

function getInitials(user) {
    const first = user?.first_name?.trim()?.[0] ?? '';
    const last = user?.last_name?.trim()?.[0] ?? '';
    const initials = `${first}${last}`.toUpperCase();

    if (initials) {
        return initials;
    }

    return user?.email_address?.trim()?.[0]?.toUpperCase() ?? 'U';
}

function getDisplayName(user) {
    const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();

    return name || user?.email_address || 'User';
}

function formatUserType(userType) {
    if (!userType) {
        return 'Member';
    }

    return String(userType)
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function UserMenu({ className }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    if (!user) {
        return null;
    }

    const displayName = getDisplayName(user);

    const logout = () => {
        router.post('/logout');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    'group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left outline-none transition-colors',
                    'hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                    'data-popup-open:bg-primary/10',
                    className,
                )}
            >
                <Avatar size="default">
                    <AvatarFallback className="bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                        {getInitials(user)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-sidebar-foreground transition-colors group-hover:text-primary">
                        {displayName}
                    </div>
                    <div className="truncate text-xs text-sidebar-foreground/70 transition-colors group-hover:text-primary/70">
                        {formatUserType(user.user_type)}
                    </div>
                </div>
                <Icon
                    name="arrow-up-s-line"
                    className="text-base text-sidebar-foreground/70 transition-all group-hover:text-primary group-data-popup-open:rotate-180"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-(--anchor-width) min-w-56"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-2">
                        <div className="flex items-center gap-3">
                            <Avatar size="default">
                                <AvatarFallback className="bg-primary/15 text-primary">
                                    {getInitials(user)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-foreground">
                                    {displayName}
                                </div>
                                <div className="truncate text-xs text-muted-foreground">
                                    {user.email_address}
                                </div>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <div className="px-1 py-1">
                    <ThemeSwitcher />
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={logout}
                >
                    <Icon name="logout-box-r-line" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
