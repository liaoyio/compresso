/*
This is a license checker. If the user is not licensed, we show a dialog asking them to buy the app.
*/

import { createSupabaseClient } from "@/lib/auth/create-supabase-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from "./use-auth";
import { useAccess } from "./use-access";
import { Button } from "../ui/button";
import { UserButton } from "../file-preview/user-button";


export const supabase = createSupabaseClient();

export const LicenseChecker = () => {
  const { hasPaid, loadingAccess } = useAccess();
  const { userId, email } = useAuth();

  if (hasPaid) {
    return null;
  }

  if (loadingAccess) return null;

  return (
    <Dialog open={!hasPaid}>
      <DialogContent hideCloseButton>
        <DialogTitle className="sr-only">Activate Compresso</DialogTitle>
        <DialogDescription asChild>
          <div>
            <h1 className="text-lg font-medium">Complete your activation</h1>

            <div className="flex flex-col gap-4 mt-10">
              <StepContainer>
                <NumberIcon>1</NumberIcon>
                <StepContent>
                  <a
                    className="w-full"
                    target="_blank"
                    href={`https://app.rotato.app/compresso-desktop?id=${userId}&email=${email}`}
                  >
                    <Button className="w-full">Activate Compresso</Button>
                  </a>
                  <div>
                    You will be taken to a web page where you can complete your
                    activation.
                  </div>
                </StepContent>
              </StepContainer>

              <StepContainer>
                <NumberIcon>2</NumberIcon>
                <StepContent>
                  <div>
                    When you've activated, this screen will go away after 10
                    seconds.
                  </div>
                </StepContent>
              </StepContainer>
            </div>
            <div className="mt-5 text-sm text-foreground/50 w-full text-right">
              <UserButton />
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export const NumberIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="w-10 h-10 bg-foreground/5 
    rounded-full flex items-center justify-center  text-lg"
    >
      {children} 
    </div>
  );
};

const StepContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-start w-full gap-2">{children} </div>;
};

const StepContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2 w-1/2">{children}</div>;
};
