import { Link } from '@inertiajs/react';

export default function AuthLayout({ children }) {
    return (
        <div className="flex h-dvh overflow-y-hidden">
            <div className="relative flex flex-1 items-center justify-center lg:flex-[0.48]">
                <div className="absolute inset-0 flex min-h-full flex-col items-center overflow-y-auto">
                    <div className="mx-auto w-full px-5 py-8">
                        <Link href="/">
                            <img
                                className="mx-auto block h-11 lg:mx-0"
                                src="/images/axiom-logo.svg"
                                alt="Axiom School"
                            />
                        </Link>
                    </div>
                    <div className="mx-auto flex w-full max-w-110 flex-1 flex-col justify-center p-5">
                        {children}
                    </div>
                    <div className="p-5">
                        <div className="flex flex-row items-center space-x-5 text-sm text-muted-foreground">
                            <a className="hover:text-foreground" href="/">
                                Terms & Conditions
                            </a>
                            <a className="hover:text-foreground" href="/">
                                Privacy Policy
                            </a>
                            <a className="hover:text-foreground" href="/">
                                Help
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative hidden overflow-hidden bg-card lg:flex lg:flex-1 lg:items-center lg:justify-center">
                <div
                    aria-hidden="true"
                    className="auth-panel-glow pointer-events-none absolute inset-0"
                />

                <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-10 py-12 text-center xl:px-14">
                    <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                        School operations, unified
                    </p>
                    <h2 className="max-w-xl text-3xl leading-tight font-semibold tracking-tight text-foreground xl:text-4xl">
                        Run your campus with clarity from day one.
                    </h2>
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground xl:text-lg">
                        Attendance, academics, staff, and finance in one calm
                        workspace—so your team spends less time chasing records
                        and more time supporting students.
                    </p>

                    <img
                        className="mt-10 w-full max-w-2xl object-contain drop-shadow-xl"
                        src="/images/auth-dashboard-hero.png"
                        alt="Axiom school management dashboard preview"
                    />
                </div>
            </div>
        </div>
    );
}
