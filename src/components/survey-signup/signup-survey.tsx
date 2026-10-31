import { signupQuestions, signupSurveyId } from "./signup-survey-questions";
import { Survey } from "../survey/survey";
import { SurveyAnswer } from "../survey/types";
import { createSupabaseClient } from "@/lib/auth/create-supabase-client";
import { PostHog, usePostHog } from "posthog-js/react";
import { ScrollArea } from "../ui/scroll-area";
import { useSurvey } from "../survey/use-survey";
import { sendToDiscord } from "@/lib/send-to-discord";
import { useAuth } from "../auth/use-auth";

const client = createSupabaseClient();

type HandleSurveyQuestion = {
  questionId: string;
  answer: string;
  other?: string;
  posthog: PostHog;
  surveyId: string;
};

export const handleSurveyQuestion = async ({
  questionId,
  answer,
  other,
  posthog,
  surveyId,
}: HandleSurveyQuestion) => {
  const { error } = await client.from("SurveyAnswers").insert({
    question_id: questionId,
    answer: answer,
    other: other,
    survey_id: surveyId,
  });

  posthog.capture("survey_question", {
    survey_id: signupSurveyId,
    question_id: questionId,
    answer: answer,
    other: other,
  });

  posthog.people.set({
    [questionId]: answer,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const SignupSurvey = ({ onCompleted }: { onCompleted: () => void }) => {
  const posthog = usePostHog();
  const { email } = useAuth();
  const { didCompleteSurvey, markCompleted, isLoading } =
    useSurvey(signupSurveyId);

  const handleSurveyDone = (answers: SurveyAnswer[]) => {
    markCompleted();

    let simpleFields: any = {};
    simpleFields = answers.map((answer) => ({
      [answer.question.id]:
        answer.answer + (answer.other ? ` (${answer.other})` : ""),
    }));
    simpleFields = [...simpleFields, { email }];
    sendToDiscord(simpleFields);
    onCompleted();
  };

  if (didCompleteSurvey || isLoading) {
    return null;
  }

  return (
    <ScrollArea>
      <Survey
        questions={signupQuestions}
        onSurveyDone={handleSurveyDone}
        onSurveyQuestion={(question) =>
          handleSurveyQuestion({
            questionId: question.question.id,
            answer: question.answer,
            other: question.other,
            posthog,
            surveyId: signupSurveyId,
          })
        }
      />
    </ScrollArea>
  );
};
