"use client";

import { Check, ChevronDown } from "lucide-react";

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  summary?: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function StepIndicator({
  stepNumber,
  title,
  isActive,
  isCompleted,
  summary,
  onEdit,
  children,
}: StepIndicatorProps) {
  return (
    <div className={`border rounded-2xl transition-colors ${
      isActive ? "border-primary bg-white" : isCompleted ? "border-border bg-white" : "border-border bg-gray-50"
    }`}>
      {/* Header */}
      <button
        onClick={isCompleted ? onEdit : undefined}
        disabled={!isCompleted}
        className={`w-full flex items-center gap-3 p-5 ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
      >
        {/* Circle */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isCompleted
            ? "bg-primary text-white"
            : isActive
            ? "bg-primary text-white"
            : "bg-gray-200 text-text-muted"
        }`}>
          {isCompleted ? <Check size={16} /> : stepNumber}
        </div>

        {/* Title + Summary */}
        <div className="flex-1 text-left">
          <span className={`font-semibold ${isActive || isCompleted ? "text-text" : "text-text-muted"}`}>
            {title}
          </span>
          {isCompleted && summary && (
            <p className="text-sm text-text-muted mt-0.5">{summary}</p>
          )}
        </div>

        {/* Edit hint */}
        {isCompleted && (
          <span className="text-xs text-primary font-medium">Editar</span>
        )}
        {isActive && (
          <ChevronDown size={16} className="text-text-muted" />
        )}
      </button>

      {/* Content */}
      {isActive && (
        <div className="px-5 pb-5 pt-0">
          {children}
        </div>
      )}
    </div>
  );
}
