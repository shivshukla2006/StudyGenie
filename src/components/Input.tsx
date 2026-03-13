import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    className={cn(
                        "flex h-11 w-full rounded-xl border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
                        error ? "border-red-500 focus:ring-red-500" : "focus:ring-[var(--btn-primary)] focus:border-transparent",
                        className
                    )}
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--card-border)',
                        color: 'var(--text-primary)',
                    }}
                    {...props}
                />
                {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);
Input.displayName = "Input";
