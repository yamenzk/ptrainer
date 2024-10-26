import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RangeInputProps } from '@/types/types';
import {
  Minus,
  Plus
} from 'lucide-react';
export const RangeInput: React.FC<RangeInputProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-500">
          {value}
        </div>
        <p className="text-gray-500 mt-2">{label(value)}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative">
          <div 
            className="absolute h-full bg-blue-500 rounded-full"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
          {Array.from({ length: ((max - min) / step) + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(min + (i * step))}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full",
                value >= min + (i * step)
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              )}
              style={{ left: `${(i / ((max - min) / step)) * 100}%` }}
            />
          ))}
        </div>
        
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};