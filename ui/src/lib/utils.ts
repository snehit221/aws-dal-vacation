export const firstLetterCapital = (str?: string) =>
  str ? `${str.charAt(0).toUpperCase()}${str?.slice(1)}` : str;

export const inputDateFormat = "YYYY-MM-DD";
