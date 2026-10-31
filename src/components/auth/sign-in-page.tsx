import { TitleBarRoot } from "../title-bar/title-bar";
import { SignIn } from "./sign-in";
import { useTrackAppearance } from "@/lib/use-track-appearance";

export const SignInPage = ({ onSignIn }: { onSignIn?: () => void }) => {
  useTrackAppearance("sign-in-page-viewed");

  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <div className="w-full absolute top-0">
        <TitleBarRoot>&nbsp;</TitleBarRoot>
      </div>

      <div className="w-full h-full flex flex-col sm:flex-row">
        <div className="sm:w-1/2 h-full p-5 flex flex-col items-center justify-center">
          <SignIn onSignIn={onSignIn} />
        </div>
        <div className="sm:w-1/2 bg-black/90 dark:bg-black/50 h-full text-white">
          <div className="flex flex-col items-center justify-center h-full">
            <CompressoLogoIcon />
            <div className="opacity-50 max-w-[10em] text-center">
              Compress multiple videos in adjustable quality with no file size
              limits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompressoLogoIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="68"
      height="68"
      fill="none"
      viewBox="0 0 68 68"
    >
      <path
        fill="#fff"
        fillOpacity="0.01"
        d="M0 0H27.878V21.298H0z"
        transform="translate(20.58 13.52)"
      ></path>
      <path
        fill="#BFF164"
        fillRule="evenodd"
        stroke="#BFF164"
        strokeWidth="1.436"
        d="M34.519 16.36c.513 0 .93.318.93.71v12.484l5.847-4.467c.363-.277.951-.277 1.314 0 .363.277.363.727 0 1.004l-7.434 5.68c-.174.132-.41.207-.657.207-.247 0-.483-.075-.657-.208l-7.435-5.68c-.363-.276-.363-.726 0-1.003.363-.277.952-.277 1.315 0l5.848 4.467V17.07c0-.392.416-.71.929-.71zM34.52 50.436c-.514 0-.93-.318-.93-.71V37.242l-5.848 4.467c-.363.277-.951.277-1.314 0-.363-.277-.363-.727 0-1.004l7.434-5.68c.174-.132.41-.207.657-.207.247 0 .483.075.657.208l7.435 5.68c.363.276.363.726 0 1.003-.363.277-.952.277-1.315 0l-5.847-4.467v12.484c0 .392-.416.71-.93.71z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
