/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export default function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const getColors = () => {
    switch (level) {
      case RiskLevel.LOW:
        return 'bg-green-50 text-green-700 border-green-200';
      case RiskLevel.MEDIUM:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case RiskLevel.HIGH:
        return 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm shadow-orange-50';
      case RiskLevel.CRITICAL:
        return 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-50';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getColors()} ${className}`}>
      {level === RiskLevel.CRITICAL && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>}
      {level}
    </span>
  );
}
