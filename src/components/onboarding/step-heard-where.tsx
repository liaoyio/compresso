import { usePostHog } from "posthog-js/react";
import { SurveyButton } from "../survey/survey-button";
import { ContentContainer, Heading } from "./calculator/primitives";
import {
  FaBlog,
  FaDiscord,
  FaGoogle,
  FaPodcast,
  FaQuestion,
  FaReddit,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { handleSurveyQuestion } from "../survey-signup/signup-survey";
import { useState } from "react";
import { Input } from "../ui/input";
import { BackButton } from "./back-button";
import { Button } from "../ui/button";

export const StepHeardWhere = ({
  onStepCompleted,
  onGoBack,
}: {
  onStepCompleted: () => void;
  onGoBack: () => void;
}) => {
  const posthog = usePostHog();
  const [other, setOther] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const onSubmit = () => {
    handleSurveyQuestion({
      questionId: "heard-where",
      answer: answer!,
      posthog,
      other: other ?? "",
      surveyId: "onboardingv2",
    });

    onStepCompleted();
  };

  return (
    <ContentContainer>
      <BackButton onGoBack={onGoBack} />

      <Heading>
        <div className=" font-normal text-base">Almost done! </div>
        How did you hear about us?
      </Heading>

      <div className="flex flex-wrap gap-2 mt-5">
        <SurveyButton
          isSelected={answer === "Twitter"}
          className="flex gap-2"
          onClick={() => setAnswer("Twitter")}
        >
          <FaTwitter />
          Twitter/X
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "Google"}
          className="flex gap-2"
          onClick={() => setAnswer("Google")}
        >
          <FaGoogle />
          Google
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "Discord"}
          className="flex gap-2"
          onClick={() => setAnswer("Discord")}
        >
          <FaDiscord />
          Discord
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "TikTok"}
          className="flex gap-2"
          onClick={() => setAnswer("TikTok")}
        >
          <FaTiktok />
          TikTok
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "Reddit"}
          className="flex gap-2"
          onClick={() => setAnswer("Reddit")}
        >
          <FaReddit />
          Reddit
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "Blog"}
          className="flex gap-2"
          onClick={() => setAnswer("Blog")}
        >
          <FaBlog />
          Blog
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "Podcast"}
          className="flex gap-2"
          onClick={() => setAnswer("Podcast")}
        >
          <FaPodcast />
          Podcast
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "Youtube"}
          className="flex gap-2"
          onClick={() => setAnswer("Youtube")}
        >
          <FaYoutube />
          Youtube
        </SurveyButton>

        <SurveyButton
          isSelected={answer === "Other"}
          className="flex gap-2"
          onClick={() => setAnswer("Other")}
        >
          <FaQuestion />
          Other
        </SurveyButton>
      </div>

      {answer && (
        <div className="flex flex-col gap-3 mt-5 max-w-lg">
          <div>Interesting! Do you remember which account?</div>

          <Input
            placeholder="e.g. @username on Twitter"
            className="bg-foreground/5 "
            autoFocus
            value={other ?? ""}
            onChange={(e) => setOther(e.target.value)}
          />

          <Button
            variant="onboarding"
            size="lg"
            className=""
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      )}
      <div></div>
    </ContentContainer>
  );
};
