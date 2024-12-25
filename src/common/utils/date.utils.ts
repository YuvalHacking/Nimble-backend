import { Logger } from "@nestjs/common";

const logger = new Logger('Date-Utils');

/**
 * Creates a Date object from a string in DD/MM/YYYY format.
 * 
 * @param {string} date - The date string in DD/MM/YYYY format.
 * @returns {Date} - The created Date object.
 * @throws Will throw an error if the date string is not in the correct format or if the date is invalid.
 */
export function createDateFromString(date: string): Date {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!regex.test(date)) {
    const errorMessage = 'Date must be in DD/MM/YYYY format';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const [day, month, year] = date.split('/').map(Number);
    return new Date(year, month - 1, day);
  } catch (error) {
    const errorMessage = 'Invalid date format';
    logger.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}