import { BatchIllustration } from "./batch-illustration";
import {
  CompareIllustration,
  MiniIllustration,
  SettingsIllustration,
} from "../illustration";

export const welcomeCarouselItems = [
  {
    title: "Shrink your videos",
    description: (
      <>
        Free up space, reduce bandwidth costs and send videos over email and
        chat
        <strong>—without losing quality</strong>
      </>
    ),
    image: `https://assets.compresso.app/onboarding/step-01.webp`,
    backgroundSize: "300%",
    backgroundPosition: "60% 50%",
  },
  {
    title: "Tweak it",
    description:
      "Downscale, speed up, remove audio, reduce audio to compress up to 99%. Simple and easy settings.",
    image: `https://assets.compresso.app/onboarding/step-01-settings.webp`,
    backgroundSize: "60%",
    backgroundPosition: "100% 0%",
    illustration: SettingsIllustration,
  },
  {
    title: "Batch them up",
    description:
      "Drag in as many videos as you want and keep doing what you were doing.",
    image: `https://assets.compresso.app/onboarding/step-01-batch.webp`,
    backgroundSize: "130%",
    backgroundPosition: "0% 50%",
    illustration: BatchIllustration,
  },
  {
    title: "Go big",
    description:
      "Got hours of footage? Whole movies? Compress any size video. Megabytes, Gigabytes, Terabytes. We’ve got you.",
    image: ``,
    backgroundSize: "300%",
    backgroundPosition: "60% 50%",
  },
  {
    title: "Go small",
    description:
      "Float a tiny window on top of your other apps, always ready to drag in videos to compress.",
    image: `https://assets.compresso.app/onboarding/step-01-mini.webp`,
    backgroundSize: "",
    backgroundPosition: "100% 25%",
    illustration: MiniIllustration,
  },
  {
    title: "Compare",
    description:
      "If 90% smaller sounds too good to be true, see it with your own two eyes with the comparison slider.",
    image: `https://assets.compresso.app/onboarding/step-01.webp`,
    backgroundSize: "300%",
    backgroundPosition: "60% 50%",
    illustration: CompareIllustration,
  },
];
