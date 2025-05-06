'use client';

import * as React from 'react';
import { Input } from './input';
import { cn } from '../../lib/utils';

export interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    // Basic US phone mask logic
    const formatPhoneNumber = (value: string) => {
      if (!value) return value;

      // Remove all non-digits
      const phoneNumber = value.replace(/[^\d]/g, '');

      // Limit to 10 digits
      const phoneNumberLimited = phoneNumber.substring(0, 10);

      // Apply mask based on length
      if (phoneNumberLimited.length < 4) {
        return phoneNumberLimited;
      } else if (phoneNumberLimited.length < 7) {
        return `(${phoneNumberLimited.substring(0, 3)}) ${phoneNumberLimited.substring(3)}`;
      } else {
        return `(${phoneNumberLimited.substring(0, 3)}) ${phoneNumberLimited.substring(
          3,
          6
        )}-${phoneNumberLimited.substring(6, 10)}`;
      }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      e.target.value = formattedValue;
    };

    return (
      <div className="space-y-1">
        <Input
          type="tel"
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          onInput={handleInput}
          placeholder="(555) 123-4567"
          {...props}
        />
        {helperText && (
          <p className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };