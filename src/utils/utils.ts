import * as _ from "../utils/prototypes";

/**
 * Returns a random number between the arguments (inclusive).
 * If the second argument is omitted, returns a positive number between 0 and the given argument
 *
 * Usage:
 *
 * randomInt(start, end)
 *
 * randomInt(end)
 * @param  {number} [start=0]
 * @param  {number} end
 */
export function randomInt(start: number, end?: number): number {
  var a, b;
  if (typeof end === "undefined") {
    a = 0;
    b = start;
  } else {
    a = start;
    b = end;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}

/**
 * Returns the first object, which has a 'key' attribute equaling value
 *
 * Returns undefined in case not found
 * @param  {T[]} source
 * @param  {string} key
 * @param  {K} value
 * @returns T
 */
export function lookUpBasedOnKey<T, K>(source: readonly T[], key: string, value: K): T | undefined {
  for (let x of source) {
    if (x[key] === value) return x;
  }
  return undefined;
}
