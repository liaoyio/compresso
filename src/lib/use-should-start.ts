// import { useEffect } from "react";
// import { useIsRunning } from "./store/use-compresso-files";

// export const useShouldStart = (callback: () => void) => {
//   const { isRunning } = useIsRunning();

//   useEffect(() => {
//     if (!isRunning) {
//       callback();
//     }
//   }, [isRunning, callback]);
// };