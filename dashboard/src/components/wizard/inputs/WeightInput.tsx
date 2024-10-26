import React, { useState } from 'react';
import { motion} from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps {
  value: any;
  onChange: (value: any) => void;
}
export const WeightInput: React.FC<InputProps> = ({ value, onChange }) => {
    const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
    const [localValue, setLocalValue] = useState(value ? value.toString() : '');
    
    const handleUnitChange = (newUnit: 'kg' | 'lb') => {
      setUnit(newUnit);
      if (localValue) {
        const numValue = parseFloat(localValue);
        const newValue = newUnit === 'lb' 
          ? (numValue * 2.20462).toFixed(1)
          : (numValue / 2.20462).toFixed(1);
        setLocalValue(newValue);
        onChange(newUnit === 'kg' ? parseFloat(newValue) : parseFloat(newValue) / 2.20462);
      }
    };
  
    const commonWeights = (unit === 'kg' 
      ? [50, 60, 70, 80, 90, 100] 
      : [110, 132, 154, 176, 198, 220]
    );
  
    return (
      <div className="space-y-6">
        {/* Unit Toggle */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          {(['kg', 'lb'] as const).map((unitOption) => (
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
  
        {/* Weight Input */}
        <div className="relative">
          <motion.input
            type="number"
            value={localValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setLocalValue(newValue);
              const numValue = parseFloat(newValue);
              onChange(unit === 'kg' ? numValue : numValue / 2.20462);
            }}
            className={cn(
              "w-full px-6 py-4 text-2xl font-medium text-center",
              "border rounded-2xl outline-none transition-all duration-200",
              "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            )}
            placeholder={`Enter weight in ${unit}`}
            whileFocus={{ scale: 1.02 }}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            {unit}
          </div>
        </div>
  
        {/* Common Values */}
        <div className="grid grid-cols-3 gap-2">
          {commonWeights.map((weight) => (
            <motion.button
              key={weight}
              onClick={() => {
                const newValue = weight.toString();
                setLocalValue(newValue);
                onChange(unit === 'kg' ? weight : weight / 2.20462);
              }}
              className={cn(
                "p-3 text-sm rounded-xl transition-all duration-200",
                "border relative overflow-hidden",
                localValue === weight.toString()
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Animation */}
              {localValue === weight.toString() && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                  animate={{
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
              <span className="relative">{weight} {unit}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };