import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Loader2Icon } from "lucide-react";
import { createSupabaseClient } from "@/lib/auth/create-supabase-client";
import { usePostHog } from "posthog-js/react";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { useOnboarding } from "../onboarding/use-onboarding";
import { useAuth } from "./use-auth";

const supabase = createSupabaseClient();

export const SignIn = ({ onSignIn }: { onSignIn?: () => void }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const postHog = usePostHog();
  const { setOnboardingCompleted } = useOnboarding();
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isLoggedIn) {
    if (onSignIn) onSignIn();
  }

  const handleSignIn = async (email: string) => {
    setLoading(true);
    setEmail(email);

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      setError(error.message);
      setSent(false);
      setLoading(false);
      postHog.capture("sign-in-email-error", { email, error: error.message });
    } else {
      setSent(true);
      setError(null);
      setLoading(false);
      postHog.capture("sign-in-email-success", { email });
    }
  };

  const handleSubmitOTP = async (otp: string) => {
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email!,
      token: otp,
      type: "email",
    });

    if (error) {
      setError(error.message);
      postHog.capture("sign-in-otp-error", { email, error: error.message });
    } else {
      setError(null);
      postHog.capture("sign-in-otp-success", { email });
      if (onSignIn) onSignIn();
    }

    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    const items = await Promise.all([
      MenuItem.new({
        text: "Start over",
        action: () => {
          setOnboardingCompleted(false);
        },
      }),
    ]);
    const menu = await Menu.new({ items });
    await menu.popup();
  };

  return (
    <div className="" onContextMenu={handleContextMenu}>
      {error && <p className="text-white bg-red-500 p-2 rounded-md">{error}</p>}
      {!sent && <SignInForm onSubmit={handleSignIn} />}
      {sent && <OTPForm onSubmit={handleSubmitOTP} />}
    </div>
  );
};

export const Loading = () => {
  return (
    <div className="flex w-full flex-col gap-5 my-5 items-center justify-center">
      <div>
        <Loader2Icon className="animate-spin" />
      </div>
      <div className="opacity-50">One moment</div>
    </div>
  );
};

const OTPForm = ({ onSubmit }: { onSubmit: (otp: string) => void }) => {
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col gap-2 max-w-lg justify-center items-center text-center">
      <h1 className="text-2xl font-bold mb-3">Check your email</h1>
      <p className="opacity-50 mb-5">Enter the code we sent to you.</p>
      <InputOTP
        autoFocus
        maxLength={6}
        value={otp}
        onChange={(value) => setOtp(value)}
      >
        <InputOTPGroup>
          <Slot index={0} />
          <Slot index={1} />
          <Slot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <Slot index={3} />
          <Slot index={4} />
          <Slot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="mt-10 w-full">
        <BigButton onClick={() => onSubmit(otp)}>Submit</BigButton>
      </div>
    </div>
  );
};

const BigButton = ({
  children,
  type,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "button";
}) => {
  return (
    <Button className="w-full py-5 " type={type} onClick={onClick}>
      {children}
    </Button>
  );
};

const Slot = ({ index }: { index: number }) => {
  return (
    <InputOTPSlot className="border-foreground/20 text-[2rem]" index={index} />
  );
};

const SignInForm = ({ onSubmit }: { onSubmit: (email: string) => void }) => {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email);
      }}
      className="flex flex-col gap-4  py-10 "
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-left">
          Sign in or create an account
        </h1>
        <p>We'll email you a login code.</p>
        {/* <p className="text-sm opacity-50">Sign in to continue</p> */}
      </div>
      <div className="w-full">
        <Input
          type="email"
          autoFocus
          className="w-full border-foreground/20 
           select-text
          bg-foreground/5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>

      <BigButton type="submit">Continue</BigButton>
    </form>
  );
};
