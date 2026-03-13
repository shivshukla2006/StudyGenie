import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glow';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    {
                        'hover:opacity-90': variant === 'primary',
                        'hover:opacity-80': variant === 'secondary',
                        'hover:bg-white/10': variant === 'ghost',
                        'bg-[var(--card-bg)] shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-black/5': variant === 'glow',
                    },
                    {
                        'text-[var(--btn-text)]': variant === 'primary',
                        'text-[var(--text-primary)]': variant === 'secondary' || variant === 'ghost',
                        'text-[var(--btn-primary)]': variant === 'glow',
                    },
                    {
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-8 text-base': size === 'md',
                        'h-14 px-10 text-lg': size === 'lg',
                        'h-11 w-11 p-0 flex items-center justify-center': size === 'icon',
                    },
                    className
                )}
                style={
                    variant === 'primary' ? { backgroundColor: 'var(--btn-primary)' } :
                        variant === 'secondary' ? { backgroundColor: 'var(--card-border)' } :
                            {}
                }
                {...props}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
