// src/components/wizard/inputs/DateInput.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DateInputProps } from '@/types/types';

export const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get current year and calculate ranges
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 14;

  const selectedDate = value ? new Date(value) : undefined;
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const handleDateSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    const now = new Date();
    return date > now || date < new Date(minYear, 0, 1);
  };

  return (
    <div className="relative">
      {/* Date Input Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-left",
          "bg-white dark:bg-gray-800",
          "border-2 transition-colors duration-300",
          isOpen
            ? "border-blue-500"
            : "border-gray-200 dark:border-gray-700",
          "group hover:border-blue-200 dark:hover:border-blue-800"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            isOpen
              ? "bg-blue-100 dark:bg-blue-900/30"
              : "bg-gray-100 dark:bg-gray-700",
            "group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
          )}>
            <CalendarIcon className={cn(
              "w-5 h-5 transition-colors",
              isOpen
                ? "text-blue-500"
                : "text-gray-500 dark:text-gray-400",
              "group-hover:text-blue-500"
            )} />
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Date of Birth
            </p>
            <p className="font-medium">
              {selectedDate 
                ? format(selectedDate, 'MMMM d, yyyy')
                : 'Select date'}
            </p>
          </div>
        </div>
      </motion.button>

      {/* Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="calendar-container"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: {
                opacity: 1,
                transition: {
                  when: "beforeChildren",
                  staggerChildren: 0.1
                }
              },
              hidden: {
                opacity: 0,
                transition: {
                  when: "afterChildren",
                }
              }
            }}
          >
            <motion.div
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 }
              }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              variants={{
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }
                },
                hidden: { 
                  opacity: 0, 
                  y: 10,
                  transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }
                }
              }}
              className={cn(
                "absolute top-full mt-2 w-full z-50",
                "bg-white dark:bg-gray-800 rounded-xl",
                "border border-gray-200 dark:border-gray-700",
                "shadow-xl shadow-black/5 ring-1 ring-black/5"
              )}
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentMonth(newDate);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <h2 className="font-medium">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  
                  <button
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCurrentMonth(newDate);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-3">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {dates.map((date, i) => {
                    const isSelected = selectedDate && 
                      format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    const isDisabled = isDateDisabled(date);
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

                    return (
                      <motion.button
                        key={i}
                        onClick={() => !isDisabled && handleDateSelect(date)}
                        disabled={isDisabled}
                        className={cn(
                          "relative p-2 text-sm rounded-lg",
                          "transition-colors duration-200",
                          isSelected
                            ? "text-white"
                            : isCurrentMonth
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-400 dark:text-gray-500",
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700",
                          "disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                        )}
                        whileHover={!isDisabled ? { scale: 1.1 } : undefined}
                        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="selectedDate"
                            className="absolute inset-0 bg-blue-500 rounded-lg"
                            transition={{ type: "spring", bounce: 0.2 }}
                          />
                        )}
                        <span className={cn(
                          "relative",
                          isSelected && "text-white"
                        )}>
                          {date.getDate()}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Year Quick Select */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                  {[...Array(10)].map((_, i) => {
                    const year = maxYear - i;
                    return (
                      <motion.button
                        key={year}
                        onClick={() => {
                          const newDate = new Date(currentMonth);
                          newDate.setFullYear(year);
                          setCurrentMonth(newDate);
                        }}
                        className={cn(
                          "px-3 py-1 text-sm rounded-lg whitespace-nowrap",
                          "transition-colors duration-200",
                          currentMonth.getFullYear() === year
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {year}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};