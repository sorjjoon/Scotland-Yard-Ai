export interface Clonable<T> {
  /**
   * return a deep copy of the object.
   */
  clone(): T;
}
