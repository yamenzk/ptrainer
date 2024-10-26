import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronsUpDown,
  Search,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { NationalityInputProps } from '@/types/types';
import {

export const NationalityInput: React.FC<NationalityInputProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredNations = useMemo(() => {
    if (!searchTerm) return nationalitiesList.slice(0, 10);
    return nationalitiesList.filter(nation => 
      nation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="relative">
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
            <span>{value || "Select your nationality"}</span>
            <ChevronsUpDown className="h-5 w-5 opacity-50" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Search Input */}
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-2">
              <Search className="w-4 h-4 mr-2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search nationality..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
                autoComplete="off"
              />
            </div>

            {/* Nationalities List */}
            <div className="max-h-[300px] overflow-y-auto py-1">
              {filteredNations.map((nationality) => (
                <motion.button
                  key={nationality}
                  onClick={() => {
                    onChange(nationality);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center space-x-2",
                    "hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors",
                    value === nationality && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{nationality}</span>
                  {value === nationality && (
                    <Check className="w-4 h-4 ml-auto text-blue-500" />
                  )}
                </motion.button>
              ))}
              
              {filteredNations.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No nationality found
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};