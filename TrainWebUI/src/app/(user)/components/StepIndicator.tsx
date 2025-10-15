import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center justify-between min-w-[600px] mx-auto max-w-3xl">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2 flex-1">
              {/* Circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  step.status === "completed"
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.status === "current"
                    ? "border-primary bg-background text-primary"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {step.status === "completed" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {/* Label */}
              <span
                className={`text-center text-sm transition-colors ${
                  step.status === "completed" || step.status === "current"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-300 -mt-10 mx-2">
                <div
                  className={`h-full transition-all ${
                    step.status === "completed" ? "bg-primary" : "bg-gray-300"
                  }`}
                  style={{ width: step.status === "completed" ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
