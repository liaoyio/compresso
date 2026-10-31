import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/auth/create-supabase-client";
import { usePostHog } from "posthog-js/react";
import useCompressoStore from "@/lib/store/compresso-store";

export const supabase = createSupabaseClient();

/**
 * Get info about the user's session
 */
export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const posthog = usePostHog();
  const addPendingActionAfterLogin = useCompressoStore(
    (state) => state.addPendingActionAfterLogin
  );
  const pendingActionsAfterLogin = useCompressoStore(
    (state) => state.pendingActionsAfterLogin
  );
  const purgePendingActionsAfterLogin = useCompressoStore(
    (state) => state.purgePendingActionsAfterLogin
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "SIGNED_IN") {
        posthog.identify(session?.user.email);
        posthog.people.set({
          email: session?.user.email,
          supabase_user_id: session?.user.id,
        });

        pendingActionsAfterLogin.forEach((action) => {
          action();
        });
        purgePendingActionsAfterLogin();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const email = session?.user.email;
  const userId = session?.user.id;
  const signOut = () => supabase.auth.signOut();
  const isLoadingOrLoggedIn = isLoading || !!session;

  return {
    session,
    isLoggedIn: !!session,
    email,
    signOut,
    userId,
    isLoading,
    isLoadingOrLoggedIn,
    addPendingActionAfterLogin,
  };
};
