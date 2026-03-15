import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <textarea
                    ref={ref}
                    className={cn(
                        "flex min-h-[120px] w-full rounded-xl border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
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
TextArea.displayName = "TextArea";
