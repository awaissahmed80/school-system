import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#portals', label: 'Portals' },
    { href: '#platform', label: 'Platform' },
];

const stats = [
    { value: '1', label: 'Unified workspace' },
    { value: '4', label: 'Core school areas' },
    { value: 'All', label: 'Roles, one login' },
    { value: 'Day 1', label: 'Ready to run' },
];

const features = [
    {
        icon: 'calendar-check-line',
        tone: 'primary',
        title: 'Attendance',
        copy: 'Mark, review, and share daily presence without chasing paper registers.',
    },
    {
        icon: 'book-open-line',
        tone: 'secondary',
        title: 'Academics',
        copy: 'Classes, subjects, and progress stay aligned for every staff member.',
    },
    {
        icon: 'team-line',
        tone: 'accent',
        title: 'People & roles',
        copy: 'Owners and school teams see only what they need—nothing more.',
    },
    {
        icon: 'wallet-3-line',
        tone: 'primary',
        title: 'Finance clarity',
        copy: 'Keep fee and campus money trails visible in the same calm system.',
    },
    {
        icon: 'bar-chart-box-line',
        tone: 'secondary',
        title: 'Live overview',
        copy: 'A dashboard that surfaces what matters today—not another spreadsheet.',
    },
    {
        icon: 'shield-check-line',
        tone: 'accent',
        title: 'Secure access',
        copy: 'School-scoped permissions so every portal stays private and clear.',
    },
];

const portals = [
    {
        icon: 'admin-line',
        title: 'School owners',
        copy: 'Full campus control with roles, staff, and settings in one place.',
    },
    {
        icon: 'user-star-line',
        title: 'Administrators',
        copy: 'Run day-to-day operations without losing sight of the big picture.',
    },
    {
        icon: 'presentation-line',
        title: 'Teachers',
        copy: 'Attendance and class work without bouncing between tools.',
    },
    {
        icon: 'parent-line',
        title: 'Support staff',
        copy: 'Focused access for the people who keep the campus moving.',
    },
];

const toneClass = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/15 text-secondary',
    accent: 'bg-accent/15 text-accent',
};

function Welcome() {
    const { authUrl, name } = usePage().props;
    const brand = name && name !== 'Laravel' ? name : 'Axiom';
    const signInHref = authUrl || '/';

    return (
        <>
            <Head title="School operations, unified" />

            <div className="min-h-dvh bg-background font-sans text-foreground">
                <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
                    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
                        <a href="#top" className="inline-flex shrink-0 items-center">
                            <img
                                src="/images/axiom-logo.svg"
                                alt={brand}
                                className="h-8 w-auto"
                            />
                        </a>

                        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <a href={signInHref}>
                                <Button size="sm" variant="ghost">
                                    Sign in
                                </Button>
                            </a>
                            <a href={signInHref} className="hidden sm:inline-flex">
                                <Button size="sm">Get started</Button>
                            </a>
                        </div>
                    </div>
                </header>

                <section
                    id="top"
                    className="landing-hero-wash relative overflow-hidden"
                >
                    <div
                        aria-hidden="true"
                        className="landing-blob pointer-events-none absolute top-16 -right-24 size-72 rounded-full bg-secondary/20 blur-3xl"
                    />
                    <div
                        aria-hidden="true"
                        className="landing-blob pointer-events-none absolute bottom-10 -left-20 size-80 rounded-full bg-primary/15 blur-3xl [animation-delay:-5s]"
                    />

                    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:py-20">
                        <div>
                            <p className="landing-reveal text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                                {brand} School
                            </p>
                            <h1 className="landing-reveal landing-reveal-delay-1 mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
                                The easiest way to run your entire school.
                            </h1>
                            <p className="landing-reveal landing-reveal-delay-2 mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Powerful, calm, and built for real campuses—
                                attendance, academics, people, and finance in
                                one workspace your team will actually use.
                            </p>
                            <div className="landing-reveal landing-reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
                                <a href={signInHref}>
                                    <Button size="lg">
                                        Start free
                                        <Icon name="arrow-right-line" />
                                    </Button>
                                </a>
                                <a href="#features">
                                    <Button size="lg" variant="secondary">
                                        Explore features
                                    </Button>
                                </a>
                            </div>
                            <p className="landing-reveal landing-reveal-delay-4 mt-5 text-sm text-muted-foreground">
                                Already on Axiom?{' '}
                                <a
                                    href={signInHref}
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Sign in to your school
                                </a>
                            </p>
                        </div>

                        <div className="landing-reveal landing-reveal-delay-3 relative">
                            <div
                                aria-hidden="true"
                                className="absolute inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-2xl"
                            />
                            <img
                                src="/images/auth-dashboard-hero.png"
                                alt="Axiom school management dashboard"
                                className="landing-float mx-auto w-full max-w-xl object-contain drop-shadow-xl lg:max-w-none"
                            />
                        </div>
                    </div>
                </section>

                <section className="border-y border-border/70 bg-card">
                    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:px-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center md:text-left">
                                <div className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="features" className="px-5 py-20 sm:px-8 sm:py-24">
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold tracking-[0.16em] text-secondary uppercase">
                                Features
                            </p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Everything your campus needs, in one place
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                                A full feature set for modern school
                                operations—clear for admins, simple for
                                everyday staff.
                            </p>
                        </div>

                        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <li
                                    key={feature.title}
                                    className="rounded-2xl border border-border/80 bg-card p-6 transition-colors hover:border-primary/40 hover:bg-background"
                                >
                                    <div
                                        className={`flex size-12 items-center justify-center rounded-xl ${toneClass[feature.tone]}`}
                                    >
                                        <Icon
                                            name={feature.icon}
                                            className="text-2xl"
                                        />
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {feature.copy}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section
                    id="portals"
                    className="border-y border-border/70 bg-muted/50 px-5 py-20 sm:px-8 sm:py-24"
                >
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
                                Dedicated portals
                            </p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                The right view for every role
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Separate experiences for the people who run,
                                teach, and support your school—without
                                duplicate systems.
                            </p>
                        </div>

                        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {portals.map((portal) => (
                                <li
                                    key={portal.title}
                                    className="rounded-2xl bg-background p-6 shadow-sm ring-1 ring-border/70"
                                >
                                    <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <Icon
                                            name={portal.icon}
                                            className="text-xl"
                                        />
                                    </div>
                                    <h3 className="mt-5 text-base font-bold text-foreground">
                                        {portal.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {portal.copy}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section
                    id="platform"
                    className="landing-hero-wash px-5 py-20 sm:px-8 sm:py-24"
                >
                    <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-semibold tracking-[0.16em] text-accent uppercase">
                                Platform
                            </p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                A dashboard your team understands at a glance
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Infographics and clear layouts turn campus data
                                into decisions—so leaders spend less time
                                hunting reports and more time supporting
                                students.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {[
                                    'Live campus snapshot every morning',
                                    'Role-aware navigation and permissions',
                                    'Built for multi-school tenancy from day one',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 text-sm font-medium text-foreground sm:text-base"
                                    >
                                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                                            <Icon
                                                name="check-line"
                                                className="text-sm"
                                            />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <a href={signInHref}>
                                    <Button size="lg">
                                        Open your workspace
                                        <Icon name="arrow-right-line" />
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            <div
                                aria-hidden="true"
                                className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/10 blur-2xl"
                            />
                            <img
                                src="/images/auth-dashboard-hero.png"
                                alt="Axiom platform overview"
                                className="w-full object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </section>

                <section className="px-5 py-16 sm:px-8 sm:py-20">
                    <div className="landing-cta-band mx-auto w-full max-w-6xl overflow-hidden rounded-3xl px-8 py-12 text-primary-foreground sm:px-12 sm:py-14">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Ready to run your campus with clarity?
                            </h2>
                            <p className="mt-4 text-base text-primary-foreground/85 sm:text-lg">
                                Sign in to pick up where your team left off—or
                                start the term with one clear system.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <a href={signInHref}>
                                    <Button
                                        size="lg"
                                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                    >
                                        Sign in now
                                        <Icon name="arrow-right-line" />
                                    </Button>
                                </a>
                                <a href="#features">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                    >
                                        Browse features
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-border/70 bg-card px-5 py-12 sm:px-8">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:justify-between">
                        <div className="max-w-sm">
                            <img
                                src="/images/axiom-logo.svg"
                                alt={brand}
                                className="h-8 w-auto"
                            />
                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                {brand} helps schools run attendance, academics,
                                people, and finance from one calm workspace.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">
                                    Product
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                    {navLinks.map((link) => (
                                        <li key={link.href}>
                                            <a
                                                href={link.href}
                                                className="hover:text-foreground"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground">
                                    Account
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <a
                                            href={signInHref}
                                            className="hover:text-foreground"
                                        >
                                            Sign in
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={signInHref}
                                            className="hover:text-foreground"
                                        >
                                            Get started
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <h3 className="text-sm font-bold text-foreground">
                                    Trust
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <span>School-scoped access</span>
                                    </li>
                                    <li>
                                        <span>Role-based permissions</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto mt-10 w-full max-w-6xl border-t border-border/70 pt-6 text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {brand}. School operations,
                        unified.
                    </div>
                </footer>
            </div>
        </>
    );
}

export default Welcome;
