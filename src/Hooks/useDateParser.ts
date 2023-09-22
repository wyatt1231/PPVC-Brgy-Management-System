import moment from "moment";

export const parseInvalidDateToDefault = (
  date: Date | string,
  defaultString?: string
): string | null => {
  const d = moment(date);

  if (d.isValid()) {
    return d.format("YYYY-MM-DD");
  } else {
    if (typeof defaultString === "string") {
      return defaultString;
    } else {
      null;
    }
  }
  return null;
};

export const sqlFilterDate = (
  date: Date | string,
  column: string
): string | null => {
  if (!!date) {
    const d = moment(date);

    if (d.isValid()) {
      return `'${d.format("YYYY-MM-DD")}'`;
    }
  }

  return column;
};

export const sqlFilterNumber = (num: number, column: string): string | null => {
  try {
    if (!!num) {
      let parse_num: null | number = null;
      if (typeof num === "string") {
        parse_num = parseInt(num);
      }

      if (!isNaN(parse_num)) {
        return `'${parse_num}'`;
      }
    }
    return column;
  } catch (error) {
    return column;
  }
};

export const parseInvalidTimeToDefault = (
  date: string,
  defaultString?: string
): string | null => {
  const d = moment(date, "hh:mm A");

  if (d.isValid()) {
    return d.format("HH:mm:ss");
  } else {
    if (typeof defaultString === "string") {
      return defaultString;
    } else {
      null;
    }
  }
  return null;
};

export const InvalidDateToDefault = (
  date: Date | null | string,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const d = moment(date).format("MMM DD, YYYY");

  if (d.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return d;
};
