// src/components/forms/FilterDropdown.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, CheckSquare, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  title: string;
  className?: string;
  matchAll?: boolean;
  onMatchAllChange?: (matchAll: boolean) => void;
}

export const FilterDropdown = ({
  options,
  selected,
  onChange,
  title,
  className,
  matchAll,
  onMatchAllChange,
}: FilterDropdownProps) => {
  const { t } = useTranslation();
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
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const selectedCount = selected.length;

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field flex w-full items-center justify-between"
      >
        <span>
          {title}
          {selectedCount > 0 && ` (${selectedCount})`}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card p-2 shadow-lg animate-in fade-in-0 zoom-in-95">
          {onMatchAllChange && (
            <div className="border-b border-border px-2 py-2 text-sm">
              <label className="flex cursor-pointer items-center justify-between">
                <span>{t('filters.match_all')}</span>
                <input
                  type="checkbox"
                  checked={matchAll}
                  onChange={(e) => onMatchAllChange(e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
              >
                {selected.includes(option.value) ? (
                  <CheckSquare className="h-5 w-5 text-main" />
                ) : (
                  <Square className="h-5 w-5 text-muted" />
                )}
                <span className="flex-1 text-main">{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
