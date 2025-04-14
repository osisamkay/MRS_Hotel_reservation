import React from 'react';

const steps = [
  { id: 'dates', label: 'Select Dates', timeEstimate: '1 min' },
  { id: 'room', label: 'Choose Room', timeEstimate: '1 min' },
  { id: 'guests', label: 'Guest Details', timeEstimate: '1 min' },
  { id: 'payment', label: 'Payment', timeEstimate: '2 min' },
  { id: 'confirm', label: 'Confirmation', timeEstimate: '1 min' }
];

export function BookingProgress({ currentStep, onStepClick }) {
  const totalTime = steps.reduce((acc, step) => {
    const time = parseInt(step.timeEstimate);
    return acc + time;
  }, 0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm mb-8">
      <div className="text-center text-gray-600 text-sm mb-4">
        Total estimated time: {totalTime} minutes
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < steps.findIndex(s => s.id === currentStep);
          const isCurrent = step.id === currentStep;
          
          return (
            <div
              key={step.id}
              className={`
                flex items-center p-2 rounded cursor-pointer transition-all relative
                hover:bg-gray-50
                ${isCompleted ? 'text-green-600' : ''}
                ${isCurrent ? 'text-blue-600' : ''}
                md:flex-col md:text-center md:p-4
              `}
              onClick={() => onStepClick(step.id)}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'}
                ${isCurrent ? 'bg-blue-500 text-white' : ''}
                md:mb-2 md:mx-auto
              `}>
                {index + 1}
              </div>
              <div className="flex-1 md:text-center">
                <div className="font-medium">{step.label}</div>
                <div className="text-sm text-gray-500">{step.timeEstimate}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  absolute left-3 top-6 bottom-0 w-0.5
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  md:left-1/2 md:top-3 md:bottom-auto md:h-0.5 md:w-full md:-translate-x-1/2
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 