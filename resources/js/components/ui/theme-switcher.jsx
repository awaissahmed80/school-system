import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { useAppearance } from '@/hooks/use-appearance';

export const ThemeSwitcher = () => {
    const { appearance, updateAppearance } = useAppearance();
    const [darkMode, setDarkMode] = useState(() =>
        typeof document === 'undefined'
            ? false
            : document.documentElement.classList.contains('dark'),
    );

    useEffect(() => {
        setDarkMode(document.documentElement.classList.contains('dark'));
    }, [appearance]);

    const toggleTheme = (checked) => {
        updateAppearance(checked ? 'dark' : 'light');
        setDarkMode(checked);
    };

    return (
        <div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
            <Icon
                name={darkMode ? 'moon-fill' : 'sun-fill'}
                className="text-sm"
            />
            <div className="flex-1 text-sm">Dark Mode</div>
            <Switch checked={darkMode} onCheckedChange={toggleTheme} />
        </div>
    );
};
