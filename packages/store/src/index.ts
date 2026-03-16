import { create } from "zustand";

export type UserProfile = {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  presentAddress: string;
  city: string;
  district: string;
  postalCode: string;
  occupation: string;
  monthlyIncome: string;
  companyName: string;
};

export type OnboardingProgress = {
  step: number;
  nidFrontName: string;
  nidFrontImage: string | null;
  nidFrontMeta: {
    type: string;
    sizeKb: number;
    width: number;
    height: number;
  } | null;
  nidBackName: string;
  nidBackImage: string | null;
  nidBackMeta: {
    type: string;
    sizeKb: number;
    width: number;
    height: number;
  } | null;
  livenessVerified: boolean;
  livenessStatus: "idle" | "captured" | "verifying" | "verified";
  livenessImage: string | null;
  submitted: boolean;
};

export type LoanProduct = {
  id: string;
  name: string;
  interestRate: number;
  maximumAmount: number;
};

export type LoanApplication = {
  selectedLoan: LoanProduct | null;
  loanAmount: string;
  loanTenure: string;
  submitted: boolean;
};

type BankingStore = {
  userProfile: UserProfile;
  onboardingProgress: OnboardingProgress;
  loanApplication: LoanApplication;
  updateUserProfile: (payload: Partial<UserProfile>) => void;
  updateOnboardingProgress: (payload: Partial<OnboardingProgress>) => void;
  setSelectedLoan: (loan: LoanProduct) => void;
  updateLoanApplication: (payload: Partial<LoanApplication>) => void;
  resetLoanApplication: () => void;
};

const initialUserProfile: UserProfile = {
  fullName: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  presentAddress: "",
  city: "",
  district: "",
  postalCode: "",
  occupation: "",
  monthlyIncome: "",
  companyName: ""
};

const initialOnboardingProgress: OnboardingProgress = {
  step: 1,
  nidFrontName: "",
  nidFrontImage: null,
  nidFrontMeta: null,
  nidBackName: "",
  nidBackImage: null,
  nidBackMeta: null,
  livenessVerified: false,
  livenessStatus: "idle",
  livenessImage: null,
  submitted: false
};

const initialLoanApplication: LoanApplication = {
  selectedLoan: null,
  loanAmount: "",
  loanTenure: "",
  submitted: false
};

export const useBankingStore = create<BankingStore>((set) => ({
  userProfile: initialUserProfile,
  onboardingProgress: initialOnboardingProgress,
  loanApplication: initialLoanApplication,
  updateUserProfile: (payload) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...payload }
    })),
  updateOnboardingProgress: (payload) =>
    set((state) => ({
      onboardingProgress: { ...state.onboardingProgress, ...payload }
    })),
  setSelectedLoan: (loan) =>
    set((state) => ({
      loanApplication: { ...state.loanApplication, selectedLoan: loan, submitted: false }
    })),
  updateLoanApplication: (payload) =>
    set((state) => ({
      loanApplication: { ...state.loanApplication, ...payload }
    })),
  resetLoanApplication: () =>
    set({
      loanApplication: initialLoanApplication
    })
}));
