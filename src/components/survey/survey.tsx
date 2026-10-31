import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SurveyButton } from "./survey-button";
import { OtherInput } from "../survey-signup/other-input";
import { SurveyAnswer, SurveyQuestion } from "./types";

interface SurveyProps {
  questions: SurveyQuestion[];
  onSurveyDone: (answers: SurveyAnswer[]) => void;
  onSurveyQuestion: (answer: SurveyAnswer) => void;
  className?: string;
}

export const Survey = ({
  questions,
  onSurveyDone,
  onSurveyQuestion,
  className,
}: SurveyProps) => {
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer: string, other?: string) => {
    const surveyAnswer: SurveyAnswer = {
      question: currentQuestion,
      answer,
      other,
    };

    const nextAnswers = [...answers, surveyAnswer];

    setAnswers(nextAnswers);
    onSurveyQuestion(surveyAnswer);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onSurveyDone(nextAnswers);
    }
  };

  const handleOther = (other: string) => {
    handleAnswer("Other", other);
  };

  const randomizedOptions = useMemo(() => currentQuestion.options.sort(() => 0.5 - Math.random()), [currentQuestion]);

  return (
    <div className={cn("max-w-lg p-5", className)}>
      <div>{currentQuestion.message}</div>
      <h1 className="text-2xl font-bold max-w-sm">
        {currentQuestion.question}
      </h1>
      <div className="flex flex-wrap gap-2 mt-5">
        {randomizedOptions.map((option) => (
          <SurveyButton key={option} onClick={() => handleAnswer(option)}>
            {option}
          </SurveyButton>
        ))}
        {currentQuestion.allowOther && (
          <OtherInput key={currentQuestion.id} onSubmit={handleOther} />
        )}
      </div>
    </div>
  );
};
