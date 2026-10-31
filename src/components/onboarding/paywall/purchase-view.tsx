import { useRemoveWatermarkLink } from "@/components/title-bar/preview-title-bar";
import { ContentContainer } from "../calculator/primitives";
import { LoaderIcon } from "lucide-react";
import { useAccess } from "@/components/auth/use-access";
import { useEffect } from "react";

export const PurchaseView = ({
  onPurchaseCompleted,
  onGoBack,
}: {
  onPurchaseCompleted: () => void;
  onGoBack: () => void;
}) => {
  const { watermarkLink } = useRemoveWatermarkLink("pw");
  const { hasPaid, refetch } = useAccess();

  useEffect(() => {
    if (hasPaid) {
      onPurchaseCompleted();
    }
  }, [hasPaid, onPurchaseCompleted]);

  useEffect(() => {
    // check every 10 seconds if the user has paid
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <ContentContainer className="flex flex-col gap-2 items-center justify-center h-screen">
      <div className="flex flex-col gap-5 p-10 bg-foreground/5">
        <h1 className="text-2xl font-bold">We opened your check-out page</h1>
        <p>Complete the purchase to continue.</p>

        <div
          className="flex justify-center items-center
      bg-foreground/5 rounded-md p-2
      "
        >
          <div className="flex gap-2 items-center">
            <span className="font-bold">Waiting for payment...</span>
            <LoaderIcon className="w-4 h-4 animate-spin" />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 opacity-50">
        {watermarkLink && (
          <>
            <a href={watermarkLink} target="_blank">
              Open Checkout Again
            </a>
            |<button onClick={() => refetch()}>Check Payment Manually</button>
          </>
        )}
        |<button onClick={() => onGoBack()}>Cancel</button>
      </div>
    </ContentContainer>
  );
};
