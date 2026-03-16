type StepperProps = {
  steps: string[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === currentStep;
        const completed = stepNumber < currentStep;

        return (
          <div
            key={step}
            className={`rounded-xl border p-4 ${
              active
                ? "border-blue-600 bg-blue-50"
                : completed
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  active
                    ? "bg-blue-600 text-white"
                    : completed
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {stepNumber}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Step {stepNumber}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
