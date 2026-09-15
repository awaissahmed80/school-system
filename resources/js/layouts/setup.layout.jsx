import { Link } from '@inertiajs/react';

export default function SetupLayout({ children }) {
    return (
        <div className="relative min-h-dvh overflow-hidden bg-background">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklch,var(--primary)_12%,transparent),_transparent_55%)]"
            />

            <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
                <header className="mb-10 flex items-center justify-between">
                    <Link href="/setup" className="inline-flex items-center gap-3">
                        <img
                            className="h-10"
                            src="/images/axiom-logo.svg"
                            alt="Axiom School"
                        />
                    </Link>
                    <p className="text-sm text-muted-foreground">School setup</p>
                </header>

                <main className="flex flex-1 flex-col">{children}</main>

                <footer className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span>Need help? Contact support.</span>
                </footer>
            </div>
        </div>
    );
}
