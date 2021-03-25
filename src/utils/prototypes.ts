import { randomInt } from "./utils";

declare global {
  interface Array<T> {
    shuffle():void
    getRandom(pop:boolean): T
  }
}

/**
 *  Shuffle the  array in place using Fisher–Yates . 
 */
Array.prototype.shuffle =  function shuffle() {
  for(let i=this.length;0<i;i--) {
    let randomIndex = randomInt(this.length-1);
    let temp = this[i];
    this[i] = this[randomIndex];
    this[randomIndex] = temp;
  }
}

/**
 * Return a random element from the array. If pop param is true, element is removed from the array
 * @param  {boolean} pop=false
 * @returns T
 */
Array.prototype.getRandom = function getRandom<T>(pop=false): T{
  let i =  randomInt(this.length-1);
  if(pop) {
    return this.splice(i, 1)[0]
  }
  return this[i]
}
