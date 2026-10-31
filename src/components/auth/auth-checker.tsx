/*
This is an auth checker. If the user is not logged in, we show a dialog asking them to log in.
 */

import { createSupabaseClient } from "@/lib/auth/create-supabase-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { SignIn } from "./sign-in";
import { useAuth } from "./use-auth";

export const supabase = createSupabaseClient();

export const AuthChecker = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return null;
  }

  return (
    <Dialog open={!isLoggedIn}>
      <DialogContent hideCloseButton>
        <DialogTitle className="sr-only">Welcome to Compresso</DialogTitle>
        <DialogDescription asChild>
          <SignIn />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
