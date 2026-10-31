// move

export interface SurveyQuestion {
  id: string;
  message: string;
  question: string;
  options: string[];
  allowOther: boolean;
}
export interface SurveyAnswer {
  question: SurveyQuestion;
  answer: string;
  other?: string;
}
