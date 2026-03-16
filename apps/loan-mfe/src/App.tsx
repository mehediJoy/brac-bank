import { useMemo, useState } from "react";
import { Button, Card, Input, Stepper } from "@banking/ui";
import { type LoanProduct, useBankingStore } from "@banking/store";
import products from "./data/loanProducts.json";

const steps = ["Select product", "Applicant info", "Summary"];

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0
});

export default function App() {
  const { userProfile, loanApplication, setSelectedLoan, updateLoanApplication, updateUserProfile } =
    useBankingStore();
  const [step, setStep] = useState(loanApplication.submitted ? 3 : loanApplication.selectedLoan ? 2 : 1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedLoan = loanApplication.selectedLoan;
  const loanProducts = useMemo(() => products as LoanProduct[], []);

  const validateApplicant = () => {
    const nextErrors: Record<string, string> = {};
    if (!userProfile.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!userProfile.phone.trim()) nextErrors.phone = "Phone is required";
    if (!userProfile.email.trim()) nextErrors.email = "Email is required";
    if (!userProfile.monthlyIncome.trim()) nextErrors.monthlyIncome = "Monthly income is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProductSelect = (product: LoanProduct) => {
    setSelectedLoan(product);
    setStep(2);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Loan application"
        description="Choose a product, add applicant information, and submit the request."
      >
        <Stepper steps={steps} currentStep={step} />
      </Card>

      {step === 1 ? (
        <section className="grid gap-6 lg:grid-cols-3">
          {loanProducts.map((product) => (
            <Card
              key={product.id}
              title={product.name}
              description={`${product.interestRate}% interest rate`}
              className="border border-slate-100"
              actions={
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Up to {money.format(product.maximumAmount)}
                </span>
              }
            >
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Flexible financing for customers who need a clear, fast application experience.
                </p>
                <Button fullWidth onClick={() => handleProductSelect(product)}>
                  Select loan
                </Button>
              </div>
            </Card>
          ))}
        </section>
      ) : null}

      {step === 2 ? (
        <Card
          title="Applicant information"
          description={`Selected product: ${selectedLoan?.name ?? "Unknown loan"}`}
          actions={
            <Button variant="ghost" onClick={() => setStep(1)}>
              Change product
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Full Name"
              value={userProfile.fullName}
              onChange={(event) => updateUserProfile({ fullName: event.target.value })}
              error={errors.fullName}
            />
            <Input
              label="Phone"
              value={userProfile.phone}
              onChange={(event) => updateUserProfile({ phone: event.target.value })}
              error={errors.phone}
            />
            <Input
              label="Email"
              type="email"
              value={userProfile.email}
              onChange={(event) => updateUserProfile({ email: event.target.value })}
              error={errors.email}
            />
            <Input
              label="Monthly Income"
              value={userProfile.monthlyIncome}
              onChange={(event) => updateUserProfile({ monthlyIncome: event.target.value })}
              error={errors.monthlyIncome}
            />
            <Input
              label="Loan Amount"
              value={loanApplication.loanAmount}
              onChange={(event) => updateLoanApplication({ loanAmount: event.target.value })}
            />
            <Input
              label="Loan Tenure"
              placeholder="e.g. 36 months"
              value={loanApplication.loanTenure}
              onChange={(event) => updateLoanApplication({ loanTenure: event.target.value })}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                if (validateApplicant()) {
                  setStep(3);
                }
              }}
            >
              Review summary
            </Button>
          </div>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card
          title={loanApplication.submitted ? "Application submitted" : "Summary & submit"}
          description="Review the selected product and applicant details."
          actions={
            !loanApplication.submitted ? (
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
            ) : undefined
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Selected loan</p>
              <p className="mt-2 text-lg font-semibold">{selectedLoan?.name}</p>
              <p className="mt-2 text-sm text-slate-600">Interest rate: {selectedLoan?.interestRate}%</p>
              <p className="mt-1 text-sm text-slate-600">
                Max amount: {selectedLoan ? money.format(selectedLoan.maximumAmount) : "-"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Applicant details</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li>Name: {userProfile.fullName}</li>
                <li>Phone: {userProfile.phone}</li>
                <li>Email: {userProfile.email}</li>
                <li>Monthly income: {userProfile.monthlyIncome}</li>
                <li>Loan amount: {loanApplication.loanAmount || "Not specified"}</li>
                <li>Tenure: {loanApplication.loanTenure || "Not specified"}</li>
              </ul>
            </div>
          </div>

          {loanApplication.submitted ? (
            <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
              Your loan application has been submitted successfully.
            </div>
          ) : (
            <div className="mt-6 flex justify-end">
              <Button variant="success" onClick={() => updateLoanApplication({ submitted: true })}>
                Submit application
              </Button>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
