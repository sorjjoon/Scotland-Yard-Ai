/**
 * A simple fifo queue
 */
export class Queue<T> {
  private left: Node<T>;
  private right: Node<T>;
  /**
   * Add a new
   * @param  {T} value
   */
  push(value: T) {
    let v: Node<T> = new Node(value);
    v.right = this.left;
    if (this.left) {
      this.left.left = v;
    }
    this.left = v;
    this.right = this.right ?? v;
  }
  /**
   * Pop the first element in queue.
   *
   * Undefined in case of empty
   * @returns {T | undefinied}
   */
  pop(): T | undefined {
    let temp = this.right;
    if (this.left == this.right) {
      this.left = undefined;
    }
    this.right = temp?.left;

    return temp?.value;
  }
  isEmpty() {
    return this.right == null;
  }
  toString(): string {
    let a = this.left;
    let res = [];
    while (a) {
      res.push(a.value);
      a = a.right;
    }
    return res.join(";");
  }
}

class Node<T> {
  value: T;
  left: Node<T>;
  right: Node<T>;
  constructor(value) {
    this.value = value;
  }
}
