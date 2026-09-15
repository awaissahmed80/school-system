import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { PortalHeader } from '@/components/ui/portal-header';
import { SpotlightSearchProvider } from '@/components/ui/spotlight-search';

export default function PortalLayout({ children }) {
    return (
        <div className="flex h-dvh overflow-y-hidden">
            <SidebarProvider defaultOpen={true}>
                <SpotlightSearchProvider>
                    <AppSidebar />
                    <div className="flex min-w-0 flex-1 flex-col">
                        <PortalHeader />
                        <main className="min-h-0 flex-1 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </SpotlightSearchProvider>
            </SidebarProvider>
        </div>
    );
}
