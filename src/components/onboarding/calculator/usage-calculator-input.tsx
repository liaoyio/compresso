import { useState } from "react";
import { SurveyButton } from "../../survey/survey-button";
import { Button } from "../../ui/button";
import { usePostHog } from "posthog-js/react";
import { handleSurveyQuestion } from "../../survey-signup/signup-survey";
import { VStack } from "../../stacks";
import { InfoIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import {
  calculateHostingSavings,
  Savings,
  useSavingsCaluclator,
} from "./calculator";
import { formatWithCommas } from "./format-with-commas";
import {
  ContentContainer,
  Datapoint,
  DatapointLabel,
  DatapointValue,
  Heading,
  TimePeriod,
} from "./primitives";
import { Breakdown } from "./breakdown";
import byteSize from "byte-size";
import { BackButton } from "../back-button";
import { useAuth } from "@/components/auth/use-auth";

export const UsageCalculatorInput = ({
  onStepCompleted,
  onGoBack,
}: {
  onStepCompleted: () => void;
  onGoBack: () => void;
}) => {
  const posthog = usePostHog();
  const { addPendingActionAfterLogin } = useAuth();
  const [answer, setAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setAnswer(answer);
    addPendingActionAfterLogin(() => {
      try {
        handleSurveyQuestion({
          questionId: "typical-usage",
          answer,
          posthog,
          surveyId: "onboardingv2",
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  if (!answer) {
    return <Question onAnswer={handleAnswer} onGoBack={onGoBack} />;
  } else {
    return (
      <Analysis
        answer={answer}
        onGoBack={() => setAnswer(null)}
        onCompleted={onStepCompleted}
      />
    );
  }
};

const Question = ({
  onAnswer,
  onGoBack,
}: {
  onAnswer: (answer: string) => void;
  onGoBack: () => void;
}) => {
  return (
    <ContentContainer>
      <BackButton onGoBack={onGoBack} />
      <Heading>What do you typically compress videos for?</Heading>

      <div className="flex flex-wrap gap-2 mt-5">
        <SurveyButton onClick={() => onAnswer("Content for website")}>
          🌎 Hosting on the web
        </SurveyButton>
        <SurveyButton onClick={() => onAnswer("Archiving")}>
          ☁️ Archiving in the cloud
        </SurveyButton>
        <SurveyButton onClick={() => onAnswer("Archiving")}>
          💾 Archiving on disk
        </SurveyButton>
        <SurveyButton onClick={() => onAnswer("Messaging")}>
          💬 Chat & Email
        </SurveyButton>
      </div>
    </ContentContainer>
  );
};

const Analysis = ({
  answer,
  onGoBack,
  onCompleted,
}: {
  answer: string;
  onGoBack: () => void;
  onCompleted: () => void;
}) => {
  const { savings, isLoading } = useSavingsCaluclator(answer);

  return (
    <ContentContainer className="">
      <BackButton onGoBack={onGoBack} />

      <div>
        {/* <div className="text-foreground/50">Nice!</div> */}
        <Heading>Here's how much users like you are saving</Heading>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : savings ? (
        <AnalysisResult savings={savings} />
      ) : (
        <div>No data found for answer</div>
      )}

      <Button variant="onboarding" size="lg" onClick={onCompleted}>
        Contintue
      </Button>
    </ContentContainer>
  );
};

const AnalysisResult = ({ savings }: { savings: Savings }) => {
  const dailyBytes = byteSize(savings.bytes.daily);

  // const dailyCompressions = formatWithCommas(savings.count.daily);

  const monthlyBytes = byteSize(savings.bytes.monthly);
  // const monthlyCompressions = formatWithCommas(savings.count.monthly);

  const yearlyBytes = byteSize(savings.bytes.yearly);
  // const yearlyCompressions = formatWithCommas(savings.count.yearly);

  const [monthlyVisitors, setMonthlyVisitors] = useState(1000);

  const monthlyBandwidthSavings = calculateHostingSavings({
    bytesSavedPerMonth: savings.bytes.daily * 30,
    visitorsPerMonth: monthlyVisitors,
    numberOfMonths: 1,
  });

  const yearlyBandwidthSavings = calculateHostingSavings({
    bytesSavedPerMonth: savings.bytes.daily * 365,
    visitorsPerMonth: monthlyVisitors,
    numberOfMonths: 12,
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="w-full  flex gap-2">
        <Datapoint className="w-2/3">
          <DatapointLabel>Saved yearly</DatapointLabel>
          <DatapointValue
            className="text-8xl tracking-tighter text-center
        bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text "
          >
            {yearlyBytes.value} {yearlyBytes.unit}
          </DatapointValue>
        </Datapoint>

        <div className="flex flex-1 flex-col gap-2">
          <Datapoint className="w-full">
            <DatapointLabel>Saved monthly</DatapointLabel>
            <DatapointValue>
              {monthlyBytes.value} {monthlyBytes.unit}
            </DatapointValue>
          </Datapoint>

          <Datapoint className="w-full">
            <DatapointLabel>Saved daily</DatapointLabel>
            <DatapointValue>
              {dailyBytes.value} {dailyBytes.unit}
            </DatapointValue>
          </Datapoint>
        </div>
      </div>

      <h2 className="text-xl font-bold">
        Hosting {formatWithCommas(monthlyVisitors, 0)} monthly views
      </h2>
      <VStack>
        <Datapoint>
          <DatapointLabel className="flex items-center gap-2">
            Saved bandwidth costs
            <Sheet>
              <SheetTrigger>
                <InfoIcon className="w-4 h-4" />
              </SheetTrigger>
              <SheetContent>
                <SheetTitle>How do we calculate this?</SheetTitle>
                <SheetDescription asChild>
                  <Breakdown
                    monthlyVisitors={monthlyVisitors}
                    onChangedMonthlyVisitors={setMonthlyVisitors}
                    savingsCalculatorOutput={monthlyBandwidthSavings}
                  />
                </SheetDescription>
              </SheetContent>
            </Sheet>
          </DatapointLabel>
          <DatapointValue>
            ${monthlyBandwidthSavings.totalSavings}{" "}
            <TimePeriod>/month</TimePeriod>
          </DatapointValue>
        </Datapoint>
        <Datapoint>
          <DatapointLabel className="flex items-center gap-2">
            Saved bandwidth costs
            <Sheet>
              <SheetTrigger>
                <InfoIcon className="w-4 h-4" />
              </SheetTrigger>
              <SheetContent>
                <SheetTitle>How do we calculate this?</SheetTitle>
                <SheetDescription asChild>
                  <Breakdown
                    monthlyVisitors={monthlyVisitors}
                    onChangedMonthlyVisitors={setMonthlyVisitors}
                    savingsCalculatorOutput={yearlyBandwidthSavings}
                  />
                </SheetDescription>
              </SheetContent>
            </Sheet>
          </DatapointLabel>
          <DatapointValue>
            ${yearlyBandwidthSavings.totalSavings}{" "}
            <TimePeriod>/year</TimePeriod>
          </DatapointValue>
        </Datapoint>
      </VStack>
    </div>
  );
};
