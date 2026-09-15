import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import RootLayout from '../layouts/root.layout';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

initializeTheme();

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        if (name.startsWith('errors/')) {
            return resolvePageComponent(
                `../home/pages/${name}.jsx`,
                import.meta.glob('../home/pages/**/*.jsx'),
            );
        }

        return resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx'),
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <RootLayout>
                <App {...props} />
            </RootLayout>,
        );
    },
    progress: {
        color: 'var(--secondary)',
    },
});
