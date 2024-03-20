export const isValidSplit = (splitShares: number[]) => {
  if (splitShares.length == 0) return 1;
  if (
    Array.isArray(splitShares) &&
    splitShares.every((item) => typeof item === "number")
  ) {
  } else {
    return 2;
  }
};
