# React Banking Micro-Frontend Project Plan

## Summary

Build a `pnpm` monorepo with three Vite React applications and two shared packages:

- `app-shell` as the host
- `loan-mfe` and `onboarding-mfe` as remotes
- `ui-library` for shared Tailwind UI components
- `store` for shared Zustand state

The host lazy-loads each remote with `React.lazy` and `Suspense`, and shared state stays available across the host and both micro-frontends.

## Key Changes

- create `apps/app-shell`, `apps/loan-mfe`, `apps/onboarding-mfe`, `packages/ui-library`, and `packages/store`
- configure Vite Module Federation so remotes expose `./App`
- run the host on `3000`, loan MFE on `3001`, and onboarding MFE on `3002`
- build shared UI exports:
  - `Button`
  - `Input`
  - `Card`
  - `Stepper`
  - `FileUploader`
  - `CameraPreview`
  - `Loader`
- build shared state for:
  - `userProfile`
  - `onboardingProgress`
  - `loanApplication`
- implement host routes:
  - `/`
  - `/loan`
  - `/onboarding`
- implement the onboarding 4-step wizard with NID upload, camera capture, simulated liveness verification, review, and submit
- implement the loan 3-step flow with JSON-backed product selection, applicant info, summary, and submit
- add root README instructions for install, dev, build, architecture, and assumptions

## Interfaces And Contracts

- remote entry points:
  - `loan-mfe/App`
  - `onboarding-mfe/App`
- shared state includes applicant identity, address, income, onboarding progress, liveness status, selected loan, and loan submission state
- all apps consume shared components from `packages/ui-library`

## Test Plan

- verify `pnpm install` succeeds at the root
- verify `pnpm build` succeeds for all workspace apps
- verify host routes render correctly
- verify remotes are lazy-loaded through federation
- verify onboarding step validation, upload state, liveness flow, review, and submit
- verify loan product loading, selection, summary, and submit

## Assumptions

- use TypeScript and Vite for all apps
- use Zustand instead of React Context
- keep state in memory for local development
- use a local JSON file instead of a real backend for loan products
- rely on browser camera permissions for the liveness simulation
