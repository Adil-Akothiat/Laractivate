import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value:     string;
  label:     string;
  locked?:   boolean; // visually disabled — cannot be toggled
}

type InputSize = 'xs' | 'sm' | 'md' | 'lg';

interface MultiSelectProps {
  options:      MultiSelectOption[];
  values?:      string[];
  onChange:     (selected: string[]) => void;
  label?:       string;
  placeholder?: string;
  error?:       string;
  hint?:        string;
  disabled?:    boolean;
  required?:    boolean;
  inputSize?:   InputSize;
  className?:   string;
}

// ── Size maps ─────────────────────────────────────────────────────────────────

const triggerSizeMap: Record<InputSize, string> = {
  xs: 'input-xs min-h-6  text-xs',
  sm: 'input-sm min-h-8  text-sm',
  md: 'input-md min-h-10 text-sm',
  lg: 'input-lg min-h-12 text-base',
};

const badgeSizeMap: Record<InputSize, string> = {
  xs: 'badge-xs gap-0.5',
  sm: 'badge-sm gap-1',
  md: 'badge-sm gap-1',
  lg: 'badge-md gap-1',
};

const iconSizeMap: Record<InputSize, number> = {
  xs: 10,
  sm: 11,
  md: 12,
  lg: 14,
};

// ── Component ─────────────────────────────────────────────────────────────────

const MultiSelect = ({
  options,
  values = [],
  onChange,
  label,
  placeholder = 'Select options...',
  error,
  hint,
  disabled = false,
  required = false,
  inputSize = 'md',
  className = '',
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const containerRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (opt: MultiSelectOption) => {
    if (opt.locked) return;
    onChange(
      values.includes(opt.value)
        ? values.filter((v) => v !== opt.value)
        : [...values, opt.value]
    );
  };

  const deselect = (opt: MultiSelectOption, e: React.MouseEvent) => {
    if (opt.locked) return;
    e.stopPropagation();
    onChange(values.filter((v) => v !== opt.value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only clear non-locked options
    const lockedValues = options.filter((o) => o.locked).map((o) => o.value);
    onChange(lockedValues);
  };

  const selectedLabels = options.filter((o) => values.includes(o.value));
  const iconSize       = iconSizeMap[inputSize];

  // Are all selected items locked? → hide clear all
  const hasRemovable = selectedLabels.some((o) => !o.locked);

  return (
    <div className={`form-control w-full ${className}`} ref={containerRef}>

      {/* Label */}
      {label && (
        <label className="label pb-1">
          <span className="label-text font-medium">
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </span>
        </label>
      )}

      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !disabled && setOpen((o) => !o)}
        className={[
          'input input-bordered w-full flex items-center flex-wrap gap-1 cursor-pointer select-none pr-8 relative',
          triggerSizeMap[inputSize],
          error    ? 'input-error'   : '',
          disabled ? 'input-disabled opacity-60 cursor-not-allowed' : '',
        ].filter(Boolean).join(' ')}
      >
        {/* Selected badges */}
        {selectedLabels.length > 0 ? (
          selectedLabels.map((opt) => (
            <span
              key={opt.value}
              className={`badge badge-primary ${badgeSizeMap[inputSize]} shrink-0`}
            >
              {opt.label}
              {!disabled && !opt.locked && (
                <button
                  type="button"
                  onClick={(e) => deselect(opt, e)}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={`Remove ${opt.label}`}
                >
                  <X size={iconSize} />
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="text-base-content/40 text-sm">{placeholder}</span>
        )}

        {/* Right-side controls */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {hasRemovable && !disabled && (
            <button
              type="button"
              onClick={clearAll}
              className="text-base-content/40 hover:text-base-content transition-colors"
              aria-label="Clear all"
            >
              <X size={iconSize} />
            </button>
          )}
          <ChevronDown
            size={iconSize + 2}
            className={`text-base-content/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 right-0 bg-base-100 border border-base-300 rounded-xl shadow-lg overflow-hidden">
            <ul
              role="listbox"
              aria-multiselectable="true"
              className="max-h-52 overflow-y-auto py-1"
            >
              {options.length === 0 ? (
                <li className="px-3 py-6 text-center text-xs text-base-content/40">
                  No options available.
                </li>
              ) : (
                options.map((opt) => {
                  const isSelected = values.includes(opt.value);
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.locked}
                      onClick={(e) => { e.stopPropagation(); toggle(opt); }}
                      className={[
                        'flex items-center justify-between px-3 py-2 text-sm transition-colors',
                        opt.locked
                          ? 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer',
                        isSelected && !opt.locked
                          ? 'bg-primary/10 text-primary'
                          : !opt.locked
                            ? 'hover:bg-base-200 text-base-content'
                            : 'text-base-content',
                      ].filter(Boolean).join(' ')}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={iconSize} className="shrink-0" />}
                    </li>
                  );
                })
              )}
            </ul>

            {/* Footer count */}
            {selectedLabels.length > 0 && (
              <div className="px-3 py-2 border-t border-base-200 flex items-center justify-between">
                <span className="text-xs text-base-content/40">
                  {selectedLabels.length} of {options.length} selected
                </span>
                {hasRemovable && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-error hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error / hint */}
      {(error || hint) && (
        <label className="label pt-1">
          {error && <span className="label-text-alt text-error">{error}</span>}
          {hint && !error && <span className="label-text-alt text-base-content/50">{hint}</span>}
        </label>
      )}

    </div>
  );
};

export default MultiSelect;