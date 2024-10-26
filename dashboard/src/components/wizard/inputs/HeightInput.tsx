import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HeightInputProps } from '@/types/types';

export const HeightInput: React.FC<HeightInputProps> = ({ value, onChange }) => {
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [feet, setFeet] = useState(0);
  const [inches, setInches] = useState(0);
  
  // Sync feet/inches when value changes
  useEffect(() => {
    if (unit === 'ft' && value) {
      const totalInches = value / 2.54;
      setFeet(Math.floor(totalInches / 12));
      setInches(Math.round(totalInches % 12));
    }
  }, [unit, value]);

  const handleUnitChange = (newUnit: 'cm' | 'ft') => {
    setUnit(newUnit);
    if (newUnit === 'cm' && feet && inches) {
      onChange(Math.round((feet * 30.48) + (inches * 2.54)));
    }
  };

  // Common heights in cm
  const commonHeights = [150, 160, 170, 180, 190, 200];

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        {(['cm', 'ft'] as const).map((unitOption) => (
          <motion.button
            key={unitOption}
            onClick={() => handleUnitChange(unitOption)}
            className={cn(
              "flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              unit === unitOption
                ? "bg-white dark:bg-gray-700 shadow-sm text-blue-500"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {unitOption.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Height Input */}
      {unit === 'cm' ? (
        <div className="relative">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className={cn(
              "w-full p-6 pr-16 text-2xl font-medium",
              "border rounded-2xl outline-none transition-all duration-200",
              "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            )}
            placeholder="Enter height"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-medium">
            cm
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="number"
              value={feet || ''}
              onChange={(e) => {
                const ft = parseInt(e.target.value);
                setFeet(ft);
                onChange(Math.round((ft * 30.48) + (inches * 2.54)));
              }}
              className={cn(
                "w-full p-6 pr-14 text-2xl font-medium",
                "border rounded-2xl outline-none",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              )}
              placeholder="Feet"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-medium">
              ft
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={inches || ''}
              onChange={(e) => {
                const inch = parseInt(e.target.value);
                setInches(inch);
                onChange(Math.round((feet * 30.48) + (inch * 2.54)));
              }}
              className={cn(
                "w-full p-6 pr-14 text-2xl font-medium",
                "border rounded-2xl outline-none",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              )}
              placeholder="Inches"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-medium">
              in
            </div>
          </div>
        </div>
      )}

      {/* Height Visualization */}
      <div className="flex items-end justify-center h-32">
        <motion.div 
          className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-xl"
          animate={{
            height: value ? `${(value / 200) * 100}%` : "0%"
          }}
          transition={{ type: "spring", bounce: 0.2 }}
        />
      </div>

      {/* Common Heights */}
      <div className="grid grid-cols-3 gap-2">
        {commonHeights.map((height) => (
          <motion.button
            key={height}
            onClick={() => onChange(height)}
            className={cn(
              "p-2 rounded-xl border transition-all duration-200",
              value === height
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {unit === 'cm' ? (
              `${height} cm`
            ) : (
              `${Math.floor(height / 30.48)}'${Math.round((height % 30.48) / 2.54)}`
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};