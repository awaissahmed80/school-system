import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';



export const TextLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            className={cn(
                'text-foreground underline decoration-border underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
