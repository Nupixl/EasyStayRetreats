import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outline';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
    const baseStyles = 'rounded-2xl p-6 transition-all duration-200';

    const variants = {
        default: 'bg-card text-card-foreground shadow-xl shadow-black/5 border border-border',
        glass: 'glass text-foreground',
        outline: 'border-2 border-border bg-transparent',
    };

    return (
        <div className={cn(baseStyles, variants[variant], className)} {...props}>
            {children}
        </div>
    );
}

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
