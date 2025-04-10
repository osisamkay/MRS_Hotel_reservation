import React from 'react';
import { Minus, Plus } from 'lucide-react';

export function GuestSelector({ label, value, onDecrement, onIncrement, minValue = 0 }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="font-medium">{label}</span>
      <div className="flex items-center">
        <button 
          onClick={() => value > minValue && onDecrement()} 
          className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Minus size={16} />
        </button>
        <span className="mx-4 font-medium">{value}</span>
        <button 
          onClick={() => onIncrement()} 
          className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}