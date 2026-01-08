// src/components/forms/CustomCheckbox.tsx
import React from 'react';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string; // Class for the wrapper div
  labelClassName?: string; // Class for the label text
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className,
  labelClassName,
}) => {
  return (
    <label htmlFor={id} className={cn('group flex items-center gap-2 cursor-pointer', className, disabled && 'opacity-70 cursor-not-allowed')}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={cn(
          'relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border transition-all duration-200',
          checked ? 'border-accent bg-accent' : 'border-border bg-transparent',
          'group-hover:border-accent'
        )}
      >
        {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
      </div>
      <span className={cn('text-sm font-medium text-main', labelClassName)}>
        {label}
      </span>
    </label>
  );
};
