import { useCallback, useEffect, useState } from 'react';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name, value, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }    
    const host = window.location.hostname.split('.').slice(-2).join('.');        
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax;domain=.${host}`;
};

const getCookie = (name) => {
    if (typeof document === 'undefined') {
        return null;
    }

    // Match the cookie name followed by '=' and capture the value
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim(); // Remove leading spaces
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    
    return null; // Return null if the cookie doesn't exist
};

const applyTheme = (appearance) => {
    
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }    
    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    console.log('Hello there')
    const cookie_theme = getCookie('appearance');    
    
    // const currentAppearance = localStorage.getItem('appearance');
    applyTheme(cookie_theme || 'system');
};




export function useAppearance() {
    const [appearance, setAppearance] = useState(() => getCookie('appearance') || 'system');

    const updateAppearance = useCallback((mode) => {
        setAppearance(mode);
        setCookie('appearance', mode);
        applyTheme(mode);
    }, []);

    // Apply theme on mount
    useEffect(() => {
        applyTheme(appearance);
    }, []); // eslint-disable-line

    useEffect(() => {
        const mq = mediaQuery();
        if (!mq) return;

        const handler = (e) => {
            console.log('System theme changed. matches:', e.matches);
            // Only react if user hasn't overridden
            const current = getCookie('appearance') || 'system';
            if (current === 'system') {
                applyTheme('system');
            }
        };

        mq.addEventListener('change', handler);
        console.log('Listener attached to', mq);

        return () => {
            mq.removeEventListener('change', handler);
            console.log('Listener removed');
        };
    }, []);

    return { appearance, updateAppearance };
}
