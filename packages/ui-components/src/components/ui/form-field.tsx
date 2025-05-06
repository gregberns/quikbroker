'use client';

import * as React from 'react';
import { Label } from './label';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  id: string;
  label?: string;
  children: React.ReactNode;
  error?: string | undefined;
  className?: string;
}

export function FormField({
  id,
  label,
  children,
  error,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}