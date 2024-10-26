import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PhoneInputProps } from '@/types/types';

// Common country codes with their countries
const commonCountryCodes = [
  { code: '+1', country: '🇺🇸 USA' },
  { code: '+44', country: '🇬🇧 UK' },
  { code: '+971', country: '🇦🇪 UAE' },
  { code: '+91', country: '🇮🇳 India' }
] as const;

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format phone number as user types
  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters except +
    const cleaned = input.replace(/[^\d+]/g, '');
    
    // Add + if it doesn't exist at the start
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    return cleaned;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <motion.input
          ref={inputRef}
          type="tel"
          value={value || ''}
          onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "w-full p-6 text-lg rounded-2xl outline-none transition-all duration-200",
            "border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500"
          )}
          placeholder="+1 234 567 8900"
        />
        
        {/* Floating Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: focused || value ? 1 : 0,
            y: focused || value ? 0 : 10
          }}
          className="absolute left-6 top-0 -translate-y-1/2 px-2 bg-white dark:bg-gray-800 text-sm text-gray-500"
        >
          Phone Number
        </motion.div>
      </div>

      {/* Common Country Codes */}
      <div className="grid grid-cols-2 gap-2">
        {commonCountryCodes.map((option) => (
          <motion.button
            key={option.code}
            onClick={() => {
              onChange(option.code);
              inputRef.current?.focus();
            }}
            className={cn(
              "p-3 rounded-xl border transition-all duration-200",
              "hover:bg-gray-50 dark:hover:bg-gray-700/50",
              value?.startsWith(option.code) 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center space-y-1">
              <span className="text-lg">{option.code}</span>
              <p className="text-xs text-gray-500">{option.country}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Validation Message */}
      {value && !value.match(/^\+\d{1,}$/) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          Please enter a valid phone number
        </motion.p>
      )}
    </div>
  );
};