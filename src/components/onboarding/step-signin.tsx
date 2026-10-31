import { SignIn } from "../auth/sign-in";

import { BackButton } from "./back-button";

import { ContentContainer } from "./calculator/primitives";
import { useOnboarding } from "./use-onboarding";

export const StepSignIn = ({
  onStepCompleted,
  onGoBack,
}: {
  onStepCompleted: () => void;
  onGoBack: () => void;
}) => {
  const { setDidLoginDuringOnboarding } = useOnboarding();

  const handleSignIn = () => {
    setDidLoginDuringOnboarding(true);
    onStepCompleted();
  };

  return (
    <ContentContainer className="w-full h-full mt-0 p-0 ">
      <div className="w-full h-full flex gap-5 ">
        <div className="w-1/2 p-10 flex flex-col gap-5 h-full ">
          <BackButton className=" self-start" onGoBack={onGoBack} />
          <div className="grow flex items-center">
            <SignIn onSignIn={handleSignIn} />
          </div>
        </div>
        <div className="bg-black w-1/2 h-full"></div>
      </div>
    </ContentContainer>
  );
};
