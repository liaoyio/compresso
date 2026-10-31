/*

This is the onboarding HOC that will keep track of which step the user is on
and render the appropriate component from the OnboardingSteps array.

When the last step is completed, we set onboardingCompleted to true, which
is persisted in local storage via Zustand's persist middleware.

*/

import { useEffect, useState } from "react";
import { StepWelcome } from "./carousel/step-welcome";
import { UsageCalculatorInput } from "./calculator/usage-calculator-input";
import { Paywall } from "./paywall/paywall";
import { StepHeardWhere } from "./step-heard-where";
import { useOnboarding } from "./use-onboarding";
import { StepSignIn } from "./step-signin";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "../auth/use-auth";
import { Loading } from "../auth/sign-in";
import { usePostHog } from "posthog-js/react";
import { useTrackAppearance } from "@/lib/use-track-appearance";

export const OnboardingAssetsBase = "https://assets.compresso.app/onboarding";

// steps in onboarding.
// All components must implement onStepCompleted

const OnboardingSteps = [
  {
    component: StepWelcome,
    id: "welcome",
  },
  {
    component: UsageCalculatorInput,
    id: "usage-calculator",
  },
  {
    component: StepSignIn,
    id: "sign-in",
  },
  {
    component: Paywall,
    id: "paywall",
  },
  {
    component: StepHeardWhere,
    id: "source",
  },
];

export const Onboarding = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const { setOnboardingCompleted, didLoginDuringOnboarding } = useOnboarding();
  const postHog = usePostHog();

  // if the user is logged in, set onboarding completed to true
  useEffect(() => {
    if (isLoggedIn && !didLoginDuringOnboarding) {
      postHog.capture("onboarding_skipped_automatically");
      setOnboardingCompleted(true);
    }
  }, [isLoggedIn, didLoginDuringOnboarding]);

  // if loading, show a simple loader
  if (isLoading) {
    return <FullScreenLoader />;
  }

  // if the user is not logged in, show the onboarding view
  return <OnboardingView />;
};

export const FullScreenLoader = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center animate-in fade-in">
      <Loading />
    </div>
  );
};

const OnboardingView = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { setOnboardingCompleted } = useOnboarding();
  const postHog = usePostHog();

  useTrackAppearance("onboarding_started");

  const CurrentStepComponent = OnboardingSteps[currentStep].component;

  const handleStepCompleted = () => {
    postHog.capture("onboarding_step_completed", {
      step: currentStep,
      step_title: OnboardingSteps[currentStep].id,
    });

    const nextStep = currentStep + 1;
    if (nextStep < OnboardingSteps.length) {
      setCurrentStep(nextStep);
    } else {
      postHog.capture("onboarding_completed");
      setOnboardingCompleted(true);
    }
  };

  return (
    <ScrollArea>
      <div data-tauri-drag-region className="h-screen ">
        <div
          className="absolute z-[1000] top-0 left-0 w-full h-10  "
          data-tauri-drag-region
        />

        <CurrentStepComponent
          onStepCompleted={handleStepCompleted}
          onGoBack={() => setCurrentStep(currentStep - 1)}
        />
      </div>
    </ScrollArea>
  );
};
