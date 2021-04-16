import { Queue } from "../../src/domain/Queue";

describe("Test Queue", () => {
  var queue: Queue<number>;
  beforeEach(() => {
    queue = new Queue();
  });
  test("add 1", () => {
    expect(queue.isEmpty()).toBeTruthy();
    queue.push(1);

    expect(queue.isEmpty()).toBeFalsy();
    let a = queue.pop();

    expect(queue.isEmpty()).toBeTruthy();
    expect(a).toEqual(1);
    a = queue.pop();

    expect(queue.isEmpty()).toBeTruthy();
    expect(a).toBeUndefined();
  });
  test("add 0 to 999", () => {
    expect(queue.isEmpty()).toBeTruthy();
    for (let i = 0; i < 1000; i++) {
      queue.push(i);

      expect(queue.isEmpty()).toBeFalsy();
    }
    expect(String(queue)).toEqual([...Array(1000).keys()].reverse().join(";"));
    for (let i = 0; i < 1000; i++) {
      let a = queue.pop();
      expect(a).toEqual(i);
      if (i < 999) {
        expect(queue.isEmpty()).toBeFalsy();
      }
    }
    expect(queue.isEmpty()).toBeTruthy();
    expect(queue.pop()).toBeUndefined();
  });

  test("add 0 to 999, pop every other", () => {
    var popped = [];
    expect(queue.isEmpty()).toBeTruthy();
    for (let i = 0; i < 1000; i++) {
      queue.push(i);
      expect(queue.isEmpty()).toBeFalsy();
      if (i % 2) popped.push(queue.pop());
    }
    for (let i = 0; i < 500; i++) {
      popped.push(queue.pop());
      if (i < 499) {
        expect(queue.isEmpty()).toBeFalsy();
      }
    }
    expect(queue.isEmpty()).toBeTruthy();
    expect(popped).toEqual([...Array(popped.length).keys()]);
    expect(queue.pop()).toBeUndefined();

    //same test twice
    var popped = [];
    expect(queue.isEmpty()).toBeTruthy();
    for (let i = 0; i < 1000; i++) {
      queue.push(i);
      expect(queue.isEmpty()).toBeFalsy();
      if (i % 2) popped.push(queue.pop());
    }
    for (let i = 0; i < 500; i++) {
      popped.push(queue.pop());
      if (i < 499) {
        expect(queue.isEmpty()).toBeFalsy();
      }
    }
    expect(queue.isEmpty()).toBeTruthy();
    expect(popped).toEqual([...Array(popped.length).keys()]);
    expect(queue.pop()).toBeUndefined();
  });
});
