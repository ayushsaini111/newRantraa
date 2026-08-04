"use client";

import Button from "@/components/ui/Button";

export default function WelcomeBonusModal({
  open,
  onContinue,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="relative w-full max-w-md rounded-r24 bg-white dark:bg-secondary-main p-8">

        <div className="text-center">

          <div className="text-6xl mb-4">
            🎉
          </div>

          <h2 className="heading-h4">
            Welcome to Rantraa
          </h2>

          <p className="mt-3 body-default text-secondary">
            Congratulations!
          </p>

          <div className="rounded-r20 bg-primary/10 p-6 mt-6">

            <h3 className="heading-h5 text-primary">
              🎁 First 5 Minutes FREE
            </h3>

            <p className="mt-3 body-small">
              Your first consultation includes
              <br />
              <strong>5 minutes absolutely FREE.</strong>
            </p>

          </div>

          <Button
            className="w-full mt-8"
            onClick={onContinue}
          >
            Start Consultation
          </Button>
<button
  onClick={onClose}
  className="absolute top-4 right-4 text-secondary hover:text-main text-2xl"
  aria-label="Close"
>
  ✕
</button>
        </div>

      </div>

    </div>
  );
}