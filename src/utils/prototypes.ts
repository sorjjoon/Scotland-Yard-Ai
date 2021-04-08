import { randomInt } from "./utils";

declare global {
  interface Array<T> {
    shuffle(): void;
    getRandom(): T;
    popRandom(): T;
    getMax(comparator: (a: T, b: T) => number): T;
    getAllMax(comparator: (a: T, b: T) => number): T[];
  }
}

declare global {
  interface ReadonlyArray<T> {
    shuffle(): void;
    getRandom(): T;
    getMax(comparator: (a: T, b: T) => number): T;
    getAllMax(comparator: (a: T, b: T) => number): T[];
  }
}

declare global {
  interface String {
    formatString(...args: any[]);
  }
}

/**
 *  Shuffle the  array in place using Fisher–Yates .
 */
Array.prototype.shuffle = function shuffle() {
  for (let i = this.length - 1; 0 < i; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let temp = this[i];
    this[i] = this[randomIndex];
    this[randomIndex] = temp;
  }
};
/**
 * Return a random element from the array
 * @returns T
 */
Array.prototype.getRandom = function getRandom<T>(): T {
  return this[randomInt(0, this.length - 1)];
};
/**
 * Remove a random element from the array and return it
 */
Array.prototype.popRandom = function popRandom<T>(): T {
  let i = Math.floor(Math.random() * this.length);
  return this.splice(i, 1)[0];
};
/**
 * Using the provided callback find the largest element in the array.
 * The given comparator should accept two arguments, and return a number larger than 0, if the first argument is larger than the second
 * In case of ties, will always return the first largest element
 * @param  {(a:T,b:T)=>number} comparator
 * @returns {T} max
 */
Array.prototype.getMax = function getMax<T>(comparator: (a: T, b: T) => number): T {
  var max: T = this[0];

  this.forEach((x) => {
    if (comparator(max, x) < 0) {
      max = x;
    }
  });
  return max;
};

/**
 * Using the provided callback find the largest elements in the array.
 * The given comparator should accept two arguments, and return a number larger than 0, if the first argument is larger than the second
 * Will return an array of all the largest elements
 * @param  {(a:T,b:T)=>number} comparator
 * @returns {T[]} listOfMax
 */
Array.prototype.getAllMax = function getMax<T>(comparator: (a: T, b: T) => number): T[] {
  var max: T[];
  this.forEach((x) => {
    if (max == undefined) {
      max = [x];
    } else {
      let comp = comparator(max[0], x);
      if (comp == 0) {
        max.push(x);
      } else if (comp < 0) {
        max = [x];
      }
    }
  });
  return max;
};

String.prototype.formatString = function (...args: any[]) {
  var str = this.toString();
  if (arguments.length) {
    var t = typeof arguments[0];
    var key;
    args = "string" === t || "number" === t ? Array.prototype.slice.call(arguments) : arguments[0];

    for (key in args) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    }
  }
  return str;
};
