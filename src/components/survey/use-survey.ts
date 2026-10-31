import { createSupabaseClient } from "@/lib/auth/create-supabase-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const client = createSupabaseClient();

const checkForSurveyAnswer = async (surveyId: string) => {
  const { data, error } = await client
    .from("SurveyAnswers")
    .select("*")
    .eq("survey_id", surveyId);
  if (error) {
    console.error(error);
  }
  if (data?.length && data.length > 0) {
    return true;
  }
  return false;
};

// Checks database if user has an answer for this survey
export const useSurvey = (surveyId: string) => {
  // usequery to check for survey answer
  const { data, error, isLoading } = useQuery({
    queryKey: ["survey-answered", surveyId],
    queryFn: () => checkForSurveyAnswer(surveyId),
  });

  const queryClient = useQueryClient();

  if (error) {
    console.error(error);
  }

  // tell tanstack that the survey has been completed
  const markCompleted = () => {
    queryClient.setQueryData(["survey-answered", surveyId], true);
  };

  return { didCompleteSurvey: data, isLoading, markCompleted };
};
