// import { useState } from "react";

// export const LocalStorageKeys = {
//   hasPaid: "hspd",
//   hasSeenPaywall: "hspw",
// };

// export const StorageHelper = {
//   getHasSeenPaywall: () => {
//     return localStorage.getItem(LocalStorageKeys.hasSeenPaywall) === "true";
//   },
//   setHasSeenPaywall: (hasSeenPaywall: boolean) => {
//     localStorage.setItem(
//       LocalStorageKeys.hasSeenPaywall,
//       hasSeenPaywall.toString()
//     );
//   },
//   getHasPaid: () => {
//     // 11 is the code for true, just obscuring a bit
//     return localStorage.getItem(LocalStorageKeys.hasPaid) === "11";
//   },
//   setHasPaid: (hasPaid: boolean) => {
//     localStorage.setItem(LocalStorageKeys.hasPaid, hasPaid ? "11" : "00");
//   },
// };

// export const usePaywall = () => {
//   const [hasSeenPaywall, setHasSeenPaywall] = useState<boolean>(
//     StorageHelper.getHasSeenPaywall()
//   );
//   const didSeePaywall = () => {
//     StorageHelper.setHasSeenPaywall(true);
//     setHasSeenPaywall(true);
//   };

//   return { hasSeenPaywall, didSeePaywall };
// };
