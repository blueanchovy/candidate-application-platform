export function capitalizeFirstLetterOfEachWord(sentence) {
  const regex = /\b\w/g;
  return sentence.replace(regex, (match) => match.toUpperCase());
}

export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};
