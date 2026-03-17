import React, { Suspense } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { Card, Loader } from "@banking/ui";
import { useBankingStore } from "@banking/store";
import bracBankLogo from "../logo.svg";

const LoanApp = React.lazy(() => import("loan-mfe/App"));
const OnboardingApp = React.lazy(() => import("onboarding-mfe/App"));

function Dashboard() {
  const { userProfile, onboardingProgress, loanApplication } = useBankingStore();

  const livenessStatusLabel = onboardingProgress.livenessVerified
    ? "Verified"
    : onboardingProgress.livenessStatus === "verifying"
      ? "Verifying"
      : onboardingProgress.livenessStatus === "captured"
        ? "Captured"
        : "Pending";

  const loanAmountLabel = loanApplication.loanAmount
    ? loanApplication.loanAmount
    : loanApplication.selectedLoan
      ? `Up to ${loanApplication.selectedLoan.maximumAmount}`
      : "Not provided";

  const contactLabel = userProfile.email || userProfile.phone || "No contact captured";

  const onboardingNidFrontLabel = onboardingProgress.nidFrontName || "Missing";
  const onboardingNidBackLabel = onboardingProgress.nidBackName || "Missing";
  const onboardingLivenessImageLabel = onboardingProgress.livenessImage
    ? `Captured (${onboardingProgress.livenessStatus})`
    : "Not captured";

  const loanSelectedProductLabel = loanApplication.selectedLoan?.name || "None";
  const loanTenureLabel = loanApplication.loanTenure || "Not provided";
  const loanSubmissionStatusLabel = loanApplication.submitted ? "Submitted" : "Draft";

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Banking journeys in one workspace"
          description="Start onboarding, apply for a loan, and track progress from the host shell."
          className="overflow-hidden rounded-md bg-slate-950 text-white"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <p className="max-w-md text-sm text-slate-600">
                This platform helps customers complete digital onboarding, submit loan requests,
                and monitor application progress from a single unified banking portal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/onboarding"
                  className="rounded-xl bg-[rgb(2,103,223)] px-4 py-3 text-sm font-semibold text-white"
                >
                  Start onboarding
                </Link>
                <Link
                  to="/loan"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                >
                  Explore loans
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Applicant snapshot</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-400">Name</dt>
                  <dd className="font-medium">{userProfile.fullName || "Not started"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-400">Onboarding</dt>
                  <dd className="font-medium">
                    {onboardingProgress.submitted ? "Submitted" : `Step ${onboardingProgress.step}/4`}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-400">Loan</dt>
                  <dd className="font-medium">
                    {loanApplication.selectedLoan?.name || "No loan selected"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>

        <Card
          title="Status board"
          description="Shared state reflected in the host shell."
          className="rounded-md"
        >
          <div className="grid gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Liveness</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{livenessStatusLabel}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Loan amount</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{loanAmountLabel}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Contact</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{contactLabel}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card
          title="Onboarding readiness"
          description="Documents and verification progress"
          className="rounded-md"
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li>NID front: {onboardingNidFrontLabel}</li>
            <li>NID back: {onboardingNidBackLabel}</li>
            <li>Liveness image: {onboardingLivenessImageLabel}</li>
          </ul>
        </Card>
        <Card
          title="Loan readiness"
          description="Current loan application details"
          className="rounded-md"
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Selected product: {loanSelectedProductLabel}</li>
            <li>Tenure: {loanTenureLabel}</li>
            <li>Submission status: {loanSubmissionStatusLabel}</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-100 font-body text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] bg-white px-6 py-5 shadow-card md:!flex-row md:!items-center md:!justify-between">
          <div className="flex w-full md:w-auto items-center justify-between pointer-events-auto">
            <img src={bracBankLogo} alt="BRAC Bank" className="h-4 w-auto md:h-5" />
            <button
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          <nav className={`flex ${isMenuOpen ? "flex-col" : "mobile-nav-hidden"} w-full md:w-auto gap-3 text-sm font-medium md:!flex md:!flex-row md:items-center md:justify-end`}>
            {[
              ["/", "Dashboard"],
              ["/onboarding", "Onboarding"],
              ["/loan", "Loan"]
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-center ${
                    isActive
                      ? "bg-[rgb(2,103,223)] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`
                }
                end={to === "/"}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <Suspense fallback={<Loader label="Loading micro-frontend..." />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loan" element={<LoanApp />} />
            <Route path="/onboarding" element={<OnboardingApp />} />
          </Routes>
        </Suspense>

        <footer className="mt-10 pb-3">
          <p className="text-left text-xs font-medium text-slate-600">© 2026 Copyright By BRAC Bank PLC</p>
        </footer>
      </div>
    </div>
  );
}
