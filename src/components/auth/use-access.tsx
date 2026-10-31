import { usePostHog } from "posthog-js/react";
import { useAuth, supabase } from "./use-auth";
import { useQuery } from "@tanstack/react-query";
import useCompressoStore from "@/lib/store/compresso-store";

/**
 * Check if the user has access to the app.
 */

const checkAccess = async (isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    return false;
  }
  const { data, error } = await supabase.from("Purchases").select("*");

  if (error) {
    throw error;
  }
  return data.length > 0;
};

/**
 * Hook to check if the user has access to the app.
 * Caching the result.
 * Refetching on window focus.
 */
export const useAccess = () => {
  const { userId } = useAuth();
  const posthog = usePostHog();
  const { setHasPaid } = useCompressoStore((state) => ({
    setHasPaid: state.setHasPaid,
  }));
  const { hasPaid: persistedHasPaid } = useCompressoStore((state) => ({
    hasPaid: state.hasPaid,
  }));

  const q = useQuery({
    queryKey: ["access", userId],
    queryFn: async () => {
      // get status
      const hasPaid = await checkAccess(!!userId);
      // track status
      if (hasPaid) {
        posthog.capture("verified_premium", {
          user_id: userId,
        });
      }

      posthog.people.set({
        has_paid: hasPaid,
      });

      posthog.register({
        has_paid: hasPaid,
      });

      // save to persisted store key for offline access
      setHasPaid(hasPaid);
      return hasPaid;
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });

  const refetch = () => {
    q.refetch();
  };

  // Fall back to persisted state if not/until online
  const hasPaid = q.data ?? persistedHasPaid;
  const loadingAccess = q.isLoading;

  return { hasPaid, loadingAccess, refetch };
};
