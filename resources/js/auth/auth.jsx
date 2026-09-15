import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import RootLayout from '../layouts/root.layout'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {        

        if (name.startsWith('errors/')) {
            // alert("hello there");
            return resolvePageComponent(
                `../home/pages/${name}.jsx`, // or .jsx depending on your extension
                import.meta.glob('../home/pages/**/*.jsx') // or .jsx
            );
        }

        return resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <RootLayout>
                <App {...props} />
            </RootLayout>
        );
    },
    progress: {
        color: '#F3970C',
    },
});
