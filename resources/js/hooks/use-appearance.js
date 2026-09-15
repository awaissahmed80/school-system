import { useCallback, useEffect, useState } from 'react';

const APPEARANCE_COOKIE = 'appearance';

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

    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }

    return null;
};

/**
 * Resolved appearance preference.
 * Missing cookie => system (used on auth before the user ever toggles theme after login).
 */
export const getStoredAppearance = () => {
    const value = getCookie(APPEARANCE_COOKIE);

    if (value === 'light' || value === 'dark' || value === 'system') {
        return value;
    }

    return 'system';
};

export const applyTheme = (appearance) => {
    if (typeof document === 'undefined') {
        return;
    }

    const mode = appearance || 'system';
    const isDark =
        mode === 'dark' || (mode === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
};

export const initializeTheme = () => {
    applyTheme(getStoredAppearance());
};

export function useAppearance() {
    const [appearance, setAppearance] = useState(getStoredAppearance);

    const updateAppearance = useCallback((mode) => {
        setAppearance(mode);
        setCookie(APPEARANCE_COOKIE, mode);
        applyTheme(mode);
    }, []);

    useEffect(() => {
        applyTheme(appearance);
    }, [appearance]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const onSystemThemeChange = () => {
            if (getStoredAppearance() === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', onSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', onSystemThemeChange);
        };
    }, []);

    return { appearance, updateAppearance };
}
