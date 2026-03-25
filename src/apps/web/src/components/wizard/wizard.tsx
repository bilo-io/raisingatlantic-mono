"use client";

import * as React from "react";
import { cn } from "./lib/utils"; 
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "./button"; 

type WizardStep = {
  title: string;
  id: string;
  content: React.ReactNode;
};

interface WizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void;
  className?: string;
  submitLabel?: string;
}

export function Wizard({ steps, onComplete, className, submitLabel = "Submit" }: WizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete({});
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={className}>
      {/* Pagination Dots */}
      <div className="mb-8 flex justify-center gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={
              `h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentStepIndex
                  ? "w-8 bg-primary"
                  : index < currentStepIndex
                  ? "bg-primary/50"
                  : "bg-muted"
              }`
            }
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 className="mb-4 text-xl font-semibold">{steps[currentStepIndex].title}</h2>
        {steps[currentStepIndex].content}
      </div>

      <div className="flex justify-between gap-4 mt-8 pt-6 border-t">
        <Button
          type="button"
          onClick={handleBack}
          disabled={isFirstStep}
          variant="ghost"
          className={cn(
            isFirstStep && "text-muted-foreground/30 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back
          </div>
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {isLastStep ? (
            <>
              {submitLabel} <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
