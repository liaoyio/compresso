import { useEffect, useState } from "react";
import { TitleBarRoot } from "../../title-bar/title-bar";
import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useAccess } from "../../auth/use-access";
import { useRemoveWatermarkLink } from "../../title-bar/preview-title-bar";
import { Loading } from "../../auth/sign-in";

import { useQuery } from "@tanstack/react-query";
import { getPriceAndFeatures } from "./get-price-and-features";
import { PurchaseView } from "./purchase-view";
import { usePostHog } from "posthog-js/react";

// ----------------------------------------------------------------
// Paywall wrapper. If the user has paid, skips the paywall and calls onStepCompleted
// ----------------------------------------------------------------
export const Paywall = ({
  onStepCompleted,
}: {
  onStepCompleted: () => void;
}) => {
  const { hasPaid, loadingAccess } = useAccess();
  const [purchaseClicked, setPurchaseClicked] = useState(false);

  useEffect(() => {
    if (hasPaid) {
      onStepCompleted();
    }
  }, [hasPaid, onStepCompleted]);

  if (loadingAccess) {
    return <Loading />;
  }

  if (purchaseClicked) {
    return (
      <PurchaseView
        onGoBack={() => setPurchaseClicked(false)}
        onPurchaseCompleted={onStepCompleted}
      />
    );
  }

  return (
    <PaywallView
      onStepCompleted={onStepCompleted}
      setShowPurchaseView={setPurchaseClicked}
    />
  );
};

// ----------------------------------------------------------------
// Paywall UI
// ----------------------------------------------------------------
const PaywallView = ({
  onStepCompleted,
  setShowPurchaseView,
}: {
  onStepCompleted: () => void;
  setShowPurchaseView: (show: boolean) => void;
}) => {
  const posthog = usePostHog();

  const { checkoutLink } = useRemoveWatermarkLink("pw");
  const { data: priceAndFeatures, isLoading } = useQuery({
    queryKey: ["priceAndFeatures"],
    queryFn: getPriceAndFeatures,
  });

  const handleClose = () => {
    posthog.capture("onboarding_paywall_closed");
    onStepCompleted();
  };

  const handleOpenCheckout = () => {
    posthog.capture("onboarding_paywall_checkout_clicked");
    setShowPurchaseView(true);
  };

  return (
    <div className="flex flex-col h-screen justify-center">
      <TitleBarRoot>
        <></>
      </TitleBarRoot>

      {isLoading && <Loading />}

      <div className="relative max-w-2xl mx-auto bg-foreground/5 rounded-3xl">
        <div className="absolute top-0 right-0 p-3 m-2 rounded-full hover:bg-foreground/5">
          <XIcon className="w-5 h-5 opacity-60" onClick={handleClose} />
        </div>

        <div className="p-10 text-center flex flex-col gap-5">
          <div className="text-base tracking-wider font-bold opacity-90 uppercase">
            Compresso Pro lifetime membership
          </div>
          <h1 className="text-6xl font-bold">33% off</h1>

          <div className="opacity-60 text-lg">
            You've unlocked the launch offer for Compresso Pro.
          </div>

          <div className="opacity-60 grid grid-cols-2 gap-2 mt-5">
            {priceAndFeatures?.tiers.pro.features.map((feature) => (
              <FeatureItem key={feature} feature={feature} />
            ))}
          </div>

          <div className="text-xl font-bold mt-5">
            Upgrade now for <span className="line-through">$29</span>{" "}
            {priceAndFeatures?.tiers.pro.price.trim()}/once
          </div>

          <div className="">
            <a href={checkoutLink ?? undefined} target="_blank">
              <Button
                onClick={handleOpenCheckout}
                variant={"secondary"}
                className="w-full h-12 hover:bg-selection 
                  max-w-max text-xl font-bold px-5 py-8 rounded-2xl
              bg-selection text-white active:opacity-90"
              >
                Upgrade now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }: { feature: string }) => {
  return (
    <div className="flex gap-2 items-start mt-1">
      <CheckIcon className="w-4 h-4 mt-1 opacity-30" />
      <div>{feature}</div>
    </div>
  );
};
