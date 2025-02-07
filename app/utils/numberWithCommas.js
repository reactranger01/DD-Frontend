export const numberWithCommas = (number) => {
  return new Intl.NumberFormat('en-IN', {
    maximumSignificantDigits: 20,
  }).format(number);
};
