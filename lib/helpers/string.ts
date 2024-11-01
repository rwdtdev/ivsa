export const capitalize = (str: string = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getLastItem = (str: string, delimiter: string) => {
  const splittedString = str.split(delimiter);

  if (splittedString.length === 0) {
    return null;
  }

  const lastItem = splittedString[splittedString.length - 1];

  return lastItem || null;
};
