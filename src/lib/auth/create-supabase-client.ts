import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
  const supabase = createClient(
    "https://dymdagtqjiakzhpramoo.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bWRhZ3Rxamlha3pocHJhbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5OTYwNTUsImV4cCI6MjA0MDU3MjA1NX0.pXvwTBXQH3fJtEnUczMQlNaFbUTrxsMh-IK4OucT_9g"
  );
  return supabase;
};
