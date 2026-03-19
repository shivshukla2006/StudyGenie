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
                    "p-6 transition-all duration-300",
                    glow && "shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-1 ring-blue-500/50",
                    className
                )}
                style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    borderRadius: '20px'
                }}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";
