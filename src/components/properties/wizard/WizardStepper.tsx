'use client';
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface WizardStep {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  steps: WizardStep[];
  currentStep: number;
  onGoTo?: (step: number) => void;
}

export function WizardStepper({ steps, currentStep, onGoTo }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: compact progress bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-primary uppercase tracking-widest">
            Etapa {currentStep + 1} de {steps.length}
          </span>
          <span className="text-xs font-bold text-muted-foreground">{steps[currentStep]?.label}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: full step list */}
      <div className="hidden md:flex items-center gap-0 mb-10 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => isCompleted && onGoTo?.(i)}
                disabled={!isCompleted}
                className={`flex flex-col items-center gap-2 min-w-[80px] group transition-all ${
                  isCompleted ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 ${
                  isCompleted
                    ? 'bg-primary text-white border-primary'
                    : isActive
                    ? 'bg-white text-primary border-primary shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.15)]'
                    : 'bg-white text-muted-foreground border-border'
                }`}>
                  {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight ${
                  isActive ? 'text-primary' : isCompleted ? 'text-primary/60' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mt-[-16px] mx-1 transition-all ${
                  i < currentStep ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
