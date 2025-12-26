import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef, type HTMLAttributes } from 'react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outline';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, variant = 'default', children, ...props }, ref) {
    const baseStyles = 'w-full min-w-0 rounded-2xl transition-all duration-200 break-words';
    const responsivePadding = 'px-4 py-5 sm:px-6 sm:py-6';

    const variants = {
        default: `bg-card text-card-foreground shadow-xl shadow-black/5 dark:shadow-black/20 border border-border dark:border-white/5 ${responsivePadding}`,
        glass: `bg-white/70 dark:bg-black/40 backdrop-blur-md text-foreground border border-border/50 dark:border-white/10 ${responsivePadding}`,
        outline: `border-2 border-border dark:border-white/10 bg-transparent ${responsivePadding}`,
    };

    return (
        <div ref={ref} className={cn(baseStyles, variants[variant], className)} {...props}>
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-xl font-semibold tracking-tight', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-secondary', className)} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mt-6 pt-6 border-t border-border', className)} {...props}>
            {children}
        </div>
    );
}
