import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    target?: string;
    rel?: string;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    href,
    target,
    rel,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

    const variants = {
        primary: 'premium-gradient text-white shadow-lg shadow-primary/25 hover:shadow-primary/40',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        outline: 'border-2 border-border bg-transparent hover:bg-muted/50',
        ghost: 'hover:bg-muted',
        glass: 'glass hover:bg-white/10 text-foreground',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
    };

    const combinedClasses = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
        return (
            <Link href={href} className={combinedClasses} target={target} rel={rel}>
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
}
