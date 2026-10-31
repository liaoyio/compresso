import { useState } from "react";
import { Button } from "../../ui/button";

import { cn } from "@/lib/utils";
import { welcomeCarouselItems } from "./carousel-items";
import { ArrowRightIcon } from "lucide-react";

import { Example } from "./examples";
import { useArrowNavigation } from "../use-arrow-navigation";
import { useOnboarding } from "../use-onboarding";
import { usePostHog } from "posthog-js/react";

export const StepWelcome = ({
  onStepCompleted,
}: {
  onStepCompleted: () => void;
}) => {
  const { setOnboardingCompleted } = useOnboarding();
  const [currentItem, setCurrentItem] = useState(0);
  const handlePageChange = (index: number) => {
    setCurrentItem(index);
  };
  const pageData = welcomeCarouselItems[currentItem];
  const postHog = usePostHog();

  const handleNext = () => {
    postHog.capture("onboarding_welcome_carousel_next", {
      page: currentItem,
      page_title: pageData.title,
    });
    setCurrentItem((prev) => (prev + 1) % welcomeCarouselItems.length);
  };

  const handlePrevious = () => {
    setCurrentItem(
      (prev) =>
        (prev - 1 + welcomeCarouselItems.length) % welcomeCarouselItems.length
    );
  };

  useArrowNavigation({
    onNext: handleNext,
    onPrevious: handlePrevious,
  });

  return (
    <div className="flex h-screen   gap-10 " key={currentItem}>
      {/* left */}
      <div className=" pl-5  w-1/2 flex flex-col gap-4 justify-between     ">
        {/* title and description */}
        <div className="flex flex-col h-full justify-center gap-4  ">
          <h1 className="text-3xl tracking-tight font-bold">
            {pageData.title}
          </h1>
          <div className="text-xl ">{pageData.description}</div>
        </div>

        {/* pagination and get started button */}
        <div className="flex flex-col gap-4 align-bottom pb-5">
          <div className="flex gap-2 items-center ">
            {welcomeCarouselItems.map((_, index) => (
              <button
                onClick={() => handlePageChange(index)}
                key={index}
                className={cn(
                  "hover:bg-foreground/40 ",
                  "w-2 h-2 rounded-full bg-foreground/20",
                  currentItem === index ? "bg-foreground" : ""
                )}
              />
            ))}
            <button
              className="hover:bg-foreground/5 p-2 opacity-80 rounded-full"
              onClick={handleNext}
            >
              <ArrowRightIcon />
            </button>
          </div>

          {/* get started button */}
          <Button
            variant="onboarding"
            size="xl"
            className="w-min"
            onClick={onStepCompleted}
          >
            Get started
          </Button>
          <button
            onClick={() => {
              postHog.capture("onboarding_skipped_manually");
              setOnboardingCompleted(true);
            }}
            className="text-left"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>

      {/* right */}
      <div className="w-1/2 flex flex-col bg-foreground/5 justify-center gap-4   ">
        {pageData.illustration ? (
          <pageData.illustration />
        ) : (
          <Example key={currentItem} />
        )}
      </div>
    </div>
  );
};
