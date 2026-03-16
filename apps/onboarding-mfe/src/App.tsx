import { useEffect, useRef, useState } from "react";
import { Button, CameraPreview, Card, FileUploader, Input, Stepper } from "@banking/ui";
import { useBankingStore } from "@banking/store";

const steps = ["Personal info", "Address info", "Income info", "Review"];
const remoteCssKey = "css__onboarding-mfe__./App";

function readImageMetadata(file: File): Promise<{
  preview: string;
  meta: { type: string; sizeKb: number; width: number; height: number };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const preview = String(reader.result ?? "");
      if (!preview) {
        reject(new Error("Unable to read image file"));
        return;
      }

      const image = new Image();
      image.onload = () => {
        resolve({
          preview,
          meta: {
            type: file.type,
            sizeKb: file.size / 1024,
            width: image.naturalWidth,
            height: image.naturalHeight
          }
        });
      };
      image.onerror = () => reject(new Error("Unable to read image dimensions"));
      image.src = preview;
    };

    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });
}

function useRemoteStyles() {
  useEffect(() => {
    const hrefs = (window as Window & { [remoteCssKey]?: string[] })[remoteCssKey];
    if (!Array.isArray(hrefs)) return;

    hrefs.forEach((href) => {
      if (document.head.querySelector(`link[data-remote-style="${href}"]`)) {
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.remoteStyle = href;
      document.head.appendChild(link);
    });
  }, []);
}

export default function App() {
  useRemoteStyles();
  const { userProfile, onboardingProgress, updateUserProfile, updateOnboardingProgress } =
    useBankingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setIsSupported(false);
        return;
      }

      try {
        const nextStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!active) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }
        setStream(nextStream);
      } catch {
        setIsSupported(false);
      }
    };

    if (!onboardingProgress.livenessImage && !stream) {
      void startCamera();
    }

    return () => {
      active = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onboardingProgress.livenessImage, stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const validateStep = () => {
    const nextErrors: Record<string, string> = {};

    if (onboardingProgress.step === 1) {
      if (!userProfile.fullName.trim()) nextErrors.fullName = "Full name is required";
      if (!userProfile.dateOfBirth.trim()) nextErrors.dateOfBirth = "Date of birth is required";
      if (!userProfile.phone.trim()) nextErrors.phone = "Phone is required";
      if (!userProfile.email.trim()) nextErrors.email = "Email is required";
    }

    if (onboardingProgress.step === 2) {
      if (!userProfile.presentAddress.trim()) nextErrors.presentAddress = "Address is required";
      if (!userProfile.city.trim()) nextErrors.city = "City is required";
      if (!userProfile.district.trim()) nextErrors.district = "District is required";
      if (!userProfile.postalCode.trim()) nextErrors.postalCode = "Postal code is required";
    }

    if (onboardingProgress.step === 3) {
      if (!userProfile.occupation.trim()) nextErrors.occupation = "Occupation is required";
      if (!userProfile.monthlyIncome.trim()) nextErrors.monthlyIncome = "Monthly income is required";
      if (!userProfile.companyName.trim()) nextErrors.companyName = "Company name is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      updateOnboardingProgress({ step: Math.min(4, onboardingProgress.step + 1) });
    }
  };

  const previousStep = () => {
    updateOnboardingProgress({ step: Math.max(1, onboardingProgress.step - 1) });
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 360;
    const context = canvas.getContext("2d");
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");
    updateOnboardingProgress({
      livenessImage: image,
      livenessStatus: "captured"
    });
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const verifyLiveness = () => {
    updateOnboardingProgress({ livenessStatus: "verifying" });
    window.setTimeout(() => {
      updateOnboardingProgress({
        livenessStatus: "verified",
        livenessVerified: true
      });
    }, 2200);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Customer onboarding"
        description="Complete the four-step onboarding journey with documents and liveness verification."
      >
        <Stepper steps={steps} currentStep={onboardingProgress.step} />
      </Card>

      {onboardingProgress.submitted ? (
        <Card title="Onboarding submitted" description="The applicant profile is now ready for review.">
          <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
            Onboarding was submitted successfully.
          </div>
        </Card>
      ) : null}

      {onboardingProgress.step === 1 ? (
        <Card title="Personal information" description="Collect identity and verification details.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Full Name"
              value={userProfile.fullName}
              onChange={(event) => updateUserProfile({ fullName: event.target.value })}
              error={errors.fullName}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={userProfile.dateOfBirth}
              onChange={(event) => updateUserProfile({ dateOfBirth: event.target.value })}
              error={errors.dateOfBirth}
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
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="grid gap-4">
              <FileUploader
                label="NID Front"
                helperText="Upload the front side of the NID."
                fileName={onboardingProgress.nidFrontName}
                imagePreview={onboardingProgress.nidFrontImage}
                imageMeta={onboardingProgress.nidFrontMeta}
                onFileSelect={(file) => {
                  if (!file) {
                    updateOnboardingProgress({
                      nidFrontName: "",
                      nidFrontImage: null,
                      nidFrontMeta: null
                    });
                    return;
                  }

                  void readImageMetadata(file).then(({ preview, meta }) => {
                    updateOnboardingProgress({
                      nidFrontName: file.name,
                      nidFrontImage: preview,
                      nidFrontMeta: meta
                    });
                  });
                }}
              />
              <FileUploader
                label="NID Back"
                helperText="Upload the back side of the NID."
                fileName={onboardingProgress.nidBackName}
                imagePreview={onboardingProgress.nidBackImage}
                imageMeta={onboardingProgress.nidBackMeta}
                onFileSelect={(file) => {
                  if (!file) {
                    updateOnboardingProgress({
                      nidBackName: "",
                      nidBackImage: null,
                      nidBackMeta: null
                    });
                    return;
                  }

                  void readImageMetadata(file).then(({ preview, meta }) => {
                    updateOnboardingProgress({
                      nidBackName: file.name,
                      nidBackImage: preview,
                      nidBackMeta: meta
                    });
                  });
                }}
              />
            </div>

            <div className="space-y-4">
              <CameraPreview
                videoRef={videoRef}
                imageSrc={onboardingProgress.livenessImage}
                status={onboardingProgress.livenessStatus}
              />
              {!isSupported ? (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  Camera access is not available in this browser context.
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                {!onboardingProgress.livenessImage ? (
                  <Button type="button" onClick={captureImage} disabled={!stream}>
                    Capture image
                  </Button>
                ) : null}
                {onboardingProgress.livenessImage &&
                onboardingProgress.livenessStatus !== "verified" ? (
                  <Button
                    type="button"
                    onClick={verifyLiveness}
                    disabled={onboardingProgress.livenessStatus === "verifying"}
                  >
                    {onboardingProgress.livenessStatus === "verifying"
                      ? "Verifying..."
                      : "Verify liveness"}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={nextStep}>Continue</Button>
          </div>
        </Card>
      ) : null}

      {onboardingProgress.step === 2 ? (
        <Card title="Address information" description="Collect the applicant's current address details.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Present Address"
              as="textarea"
              value={userProfile.presentAddress}
              onChange={(event) => updateUserProfile({ presentAddress: event.target.value })}
              error={errors.presentAddress}
            />
            <div className="grid gap-4">
              <Input
                label="City"
                value={userProfile.city}
                onChange={(event) => updateUserProfile({ city: event.target.value })}
                error={errors.city}
              />
              <Input
                label="District"
                value={userProfile.district}
                onChange={(event) => updateUserProfile({ district: event.target.value })}
                error={errors.district}
              />
              <Input
                label="Postal Code"
                value={userProfile.postalCode}
                onChange={(event) => updateUserProfile({ postalCode: event.target.value })}
                error={errors.postalCode}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={previousStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Continue</Button>
          </div>
        </Card>
      ) : null}

      {onboardingProgress.step === 3 ? (
        <Card title="Income information" description="Capture the customer's employment and income details.">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Occupation"
              value={userProfile.occupation}
              onChange={(event) => updateUserProfile({ occupation: event.target.value })}
              error={errors.occupation}
            />
            <Input
              label="Monthly Income"
              value={userProfile.monthlyIncome}
              onChange={(event) => updateUserProfile({ monthlyIncome: event.target.value })}
              error={errors.monthlyIncome}
            />
            <Input
              label="Company Name"
              value={userProfile.companyName}
              onChange={(event) => updateUserProfile({ companyName: event.target.value })}
              error={errors.companyName}
            />
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={previousStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Review application</Button>
          </div>
        </Card>
      ) : null}

      {onboardingProgress.step === 4 ? (
        <Card title="Review & submit" description="Confirm all entered information before submission.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Profile</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Name: {userProfile.fullName}</li>
                <li>Date of birth: {userProfile.dateOfBirth}</li>
                <li>Phone: {userProfile.phone}</li>
                <li>Email: {userProfile.email}</li>
                <li>Address: {userProfile.presentAddress}</li>
                <li>City: {userProfile.city}</li>
                <li>District: {userProfile.district}</li>
                <li>Postal code: {userProfile.postalCode}</li>
                <li>Occupation: {userProfile.occupation}</li>
                <li>Monthly income: {userProfile.monthlyIncome}</li>
                <li>Company: {userProfile.companyName}</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Verification</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>NID front: {onboardingProgress.nidFrontName || "Missing"}</li>
                <li>NID back: {onboardingProgress.nidBackName || "Missing"}</li>
                <li>
                  Liveness status:{" "}
                  {onboardingProgress.livenessVerified ? "Verified" : onboardingProgress.livenessStatus}
                </li>
              </ul>
              {onboardingProgress.livenessImage ? (
                <img
                  src={onboardingProgress.livenessImage}
                  alt="Captured applicant"
                  className="mt-4 aspect-video w-full rounded-xl object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={previousStep}>
              Back
            </Button>
            <Button variant="success" onClick={() => updateOnboardingProgress({ submitted: true })}>
              Submit onboarding
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
