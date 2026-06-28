/**
 * Converts kilometers to miles.
 * @param km - The distance in kilometers.
 * @param decimalPlaces - Optional number of decimal places to round to.
 * @returns The distance in miles.
 */
export const convertKmToMiles = (km: number, decimalPlaces?: number): number => {
  const miles = km * 0.621371;
  
  if (decimalPlaces !== undefined) {
    return parseFloat(miles.toFixed(decimalPlaces));
  }
  
  return miles;
};