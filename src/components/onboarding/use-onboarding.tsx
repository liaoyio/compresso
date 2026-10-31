import useCompressoStore from "@/lib/store/compresso-store";

export const useOnboarding = () => {
  const onboardingCompleted = useCompressoStore(
    (state) => state.onboardingCompleted
  );
  const setOnboardingCompleted = useCompressoStore(
    (state) => state.setOnboardingCompleted
  );

  const didLoginDuringOnboarding = useCompressoStore(
    (state) => state.didLoginDuringOnboarding
  );
  const setDidLoginDuringOnboarding = useCompressoStore(
    (state) => state.setDidLoginDuringOnboarding
  );

  return {
    onboardingCompleted,
    setOnboardingCompleted,
    didLoginDuringOnboarding,
    setDidLoginDuringOnboarding,
  };
};
