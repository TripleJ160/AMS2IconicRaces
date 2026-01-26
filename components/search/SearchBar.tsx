'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search by driver, year, or class..." 
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange handler (150ms)
  const handleInputChange = (newValue: string) => {
    setLocalValue(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 150);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    setLocalValue('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onClear();
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-text-secondary" />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search races by driver, year, or class"
        role="searchbox"
        className="w-full pl-12 pr-12 py-3 
                   bg-black/80 backdrop-blur-md 
                   border border-red-900/50 
                   rounded-none
                   text-text-primary placeholder:text-text-muted placeholder:uppercase placeholder:tracking-wide
                   focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent
                   hover:border-red-600/50
                   transition-all duration-200
                   text-sm sm:text-base uppercase tracking-wide"
      />

      {/* Clear Button */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2
                     text-text-secondary hover:text-text-primary
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-accent-red rounded-full
                     p-1"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
