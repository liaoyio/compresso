export const formatWithCommas = (num: number, digits: number = 1) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};
export const formatAsMB = (bytes: number) => {
  const mb = bytes / 1024 / 1024;
  // forma with , delimiters thousands
  return formatWithCommas(mb);
};
