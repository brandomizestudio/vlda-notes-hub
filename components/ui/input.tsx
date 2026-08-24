import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isPasswordMono?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, isPasswordMono = false, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-[5px]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold text-ink-2 select-none"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'w-full px-[13px] py-[11px] rounded-[10px] border border-line-2 bg-card text-ink text-[15px] font-body transition-colors placeholder:text-ink-3',
            'focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-accent focus-visible:outline-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isPasswordMono &&
              'font-mono text-[17px] tracking-[0.18em] text-center bg-ground py-[13px] uppercase',
            error && 'border-lock focus-visible:outline-lock',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[12.5px] text-lock font-medium mt-1">{error}</p>}
        {helperText && !error && <p className="text-[12.5px] text-ink-3 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
