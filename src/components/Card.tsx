import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, glow, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "p-6 text-white transition-all duration-300",
                    glow && "shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-1 ring-blue-500/50",
                    className
                )}
                style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    borderRadius: '16px'
                }}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";
