import { randomInt } from "./utils";

declare global {
  interface Array<T> {
    shuffle():void
  }
}

/**
 *  Shuffle the  array in place using Fisher–Yates . 
 */
Array.prototype.shuffle =  function shuffle() {
  for(let i=this.length-1;0<i;i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let temp = this[i];
    this[i] = this[randomIndex];
    this[randomIndex] = temp;
  }
}


