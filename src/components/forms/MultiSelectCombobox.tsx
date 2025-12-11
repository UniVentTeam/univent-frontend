// src/components/forms/MultiSelectCombobox.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectComboboxProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
  closeOnSelect?: boolean;
}

export const MultiSelectCombobox = ({
  options,
  selected,
  onChange,
  className,
  placeholder = 'Select...',
  closeOnSelect = true,
}: MultiSelectComboboxProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    setSearchTerm('');
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0].value);
      }
    }
  };

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selected.includes(option.value)
      ),
    [options, searchTerm, selected]
  );

  const selectedOptions = useMemo(
    () => options.filter((option) => selected.includes(option.value)),
    [options, selected]
  );

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div
        className="input-field flex flex-wrap items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        {selectedOptions.map((option) => (
          <span key={option.value} className="tag tag-career flex items-center gap-1.5">
            {option.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(option.value);
              }}
              className="rounded-full hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex-1 min-w-[120px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? placeholder : ''}
            className="w-full bg-transparent outline-none"
          />
        </div>
        <ChevronDown
          className={`w-5 h-5 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 card bg-card p-2 shadow-lg">
          {filteredOptions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="p-2 rounded-md cursor-pointer hover:bg-bg-muted"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondary text-center p-2">{t('common.no_results')}</p>
          )}
        </div>
      )}
    </div>
  );
};
