import moment from "moment";

/**
 * Simple function to validate that the passed date matches the format.
 *
 * Time must be from 00:00 to 23:59
 * @param date string with the date-time format 'YYYY-MM-DD HH:mm'
 * @returns { boolean }
 */
const valiDate = (date: string): boolean => {
  // validates the following format:
  // YYYY-MM-DD HH:mm
  // HH:mm MUST be within this range: (00:00 to 23:59)
  // YYYY  MUST be: > 999 and < 10000
  const isValidTime = date
    .toString()
    .match(/^[1-9]\d{3}-\d{2}-\d{2} (2[0-3]|[01]\d):([0-5]\d)$/)
    ? true
    : false;

  // Validates that the rest of the date can be parsed correctly
  const formattedDate = moment(date, "YYYY-MM-DD HH:mm", true);
  const isLegalDate = formattedDate.isValid();

  // returns true if both are true
  if (isLegalDate && isValidTime) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks with valiDate to see if it matches the expected pattern,
 * then converts the date to UTC Date object and returns it if valid.
 * @param date date-time string
 * @returns { Date | null }
 */
export const stringDateTime = (date: unknown): Date | null => {
  const isValid = valiDate(date as string);
  if (isValid) {
    return moment(date as string)
      .utc()
      .toDate();
  } else {
    return null;
  }
};
