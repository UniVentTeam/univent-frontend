// src/components/forms/SelectDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  options: Option[];
  selected: string | null;
  onChange: (selected: string | null) => void;
  title: string;
  className?: string;
}

export const SelectDropdown = ({
  options,
  selected,
  onChange,
  title,
  className,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === selected);

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field flex w-full items-center justify-between"
      >
        <span>{selectedOption ? selectedOption.label : title}</span>
        <ChevronDown
          className={`h-5 w-5 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card p-2 shadow-lg animate-in fade-in-0 zoom-in-95">
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted',
                  selected === option.value && 'bg-muted',
                )}
              >
                <span className="flex-1 text-main">{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
