import React from 'react';

interface PasswordStrengthIndicatorProps {
  strength: number;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strength }) => {
  const getStrengthText = () => {
    switch(strength) {
      case 0: return { text: 'Very Weak', color: 'text-red-700' };
      case 1: return { text: 'Weak', color: 'text-red-600' };
      case 2: return { text: 'Fair', color: 'text-yellow-600' };
      case 3: return { text: 'Good', color: 'text-yellow-500' };
      case 4: return { text: 'Strong', color: 'text-green-600' };
      case 5: return { text: 'Very Strong', color: 'text-green-700' };
      default: return { text: 'Very Weak', color: 'text-red-700' };
    }
  };

  const getBarColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strengthInfo = getStrengthText();
  const barColor = getBarColor();

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password Strength:</span>
        <span className={`text-xs font-medium ${strengthInfo.color}`}>{strengthInfo.text}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div 
          className={`h-full ${barColor}`} 
          style={{ width: `${(strength / 5) * 100}%` }} 
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;