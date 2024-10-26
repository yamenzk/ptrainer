import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { DateInputProps } from '@/types/types';

export const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const formattedDate = format(date, 'dd-MM-yyyy');
    onChange(formattedDate);
  };

  // Get current year and calculate ranges
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 14; // Minimum age of 14

  // Generate year options
  const yearOptions = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  // Generate month options
  const monthOptions = Array.from(
    { length: 12 },
    (_, i) => ({
      value: i,
      label: format(new Date(2000, i, 1), 'MMMM')
    })
  );

  const selectedDate = value ? parse(value, 'dd-MM-yyyy', new Date()) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full p-6 text-left font-normal border rounded-2xl",
            "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "flex items-center justify-between",
            !value && "text-muted-foreground",
            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          )}
        >
          {value ? 
            format(parse(value, 'dd-MM-yyyy', new Date()), 'MMMM d, yyyy') : 
            <span>Pick your date of birth</span>
          }
          <CalendarIcon className="h-5 w-5 opacity-50" />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="grid gap-4">
          {/* Year and Month Selectors */}
          <div className="grid grid-cols-2 gap-2">
            {/* Year Selector */}
            <select
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm",
                "bg-white dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
              value={selectedDate ? selectedDate.getFullYear() : maxYear}
              onChange={(e) => {
                const newDate = selectedDate || new Date();
                newDate.setFullYear(parseInt(e.target.value));
                handleSelect(newDate);
              }}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Month Selector */}
            <select
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm",
                "bg-white dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
              value={selectedDate ? selectedDate.getMonth() : 0}
              onChange={(e) => {
                const newDate = selectedDate || new Date();
                newDate.setMonth(parseInt(e.target.value));
                handleSelect(newDate);
              }}
            >
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={(date) => {
              const now = new Date();
              return (
                date > now || 
                date < new Date(minYear, 0, 1) ||
                date > new Date(maxYear, 11, 31)
              );
            }}
            initialFocus
            className={cn(
              "rounded-lg border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800"
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};