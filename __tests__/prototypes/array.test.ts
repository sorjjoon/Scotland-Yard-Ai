require("../../src/utils/prototypes");

describe("Test Array.shuffle", () => {
  const orginalArr = [];
  for (let i = 0; i < 100; i++) {
    orginalArr.push(i);
  }
  const shuffledArray = orginalArr.map((x) => x);

  shuffledArray.shuffle();

  test("Array doesn't change in length", () => {
    expect(shuffledArray.length).toEqual(orginalArr.length);
  });
  test("Array contents don't change", () => {
    shuffledArray.sort(function (x, y) {
      return x - y;
    });
    expect(shuffledArray).toEqual(orginalArr);
  });
});

describe("Test Array.getRandom", () => {
  const testArr = [];
  for (let i = 0; i < 10; i++) {
    testArr.push(i);
  }

  test("element in array", () => {
    for (let i = 0; i < 100; i++) {
      expect(testArr).toContain(testArr.getRandom());
    }
  });

  test("all elements can be found", () => {
    const elements = [];
    for (let i = 0; i < 300; i++) {
      elements.push(testArr.getRandom());
    }
    //Could fail if for some reason 300 randoms didn't yield all values
    testArr.forEach((element) => {
      expect(elements).toContain(element);
    });
  });
});
describe("Test Array.popRandom", () => {
  var testArr: number[], testArrCopy: number[];
  beforeEach(() => {
    testArr = [];
    testArrCopy = [];
    for (let i = 0; i < 10; i++) {
      testArr.push(i);
      testArrCopy.push(i);
    }
  });

  test("element is popped", () => {
    for (let i = 0; i < 10; i++) {
      let x = testArr.popRandom();
      expect(testArrCopy).toContain(x);
      expect(testArr).not.toContain(x);
    }
  });
  test("one is popped at a time", () => {
    expect(testArr.length).toEqual(testArrCopy.length);
    for (let i = testArrCopy.length; i > 0; i--) {
      testArr.popRandom();
      expect(testArr.length).toEqual(i - 1);
    }
  });
  test("all elements can be found", () => {
    const elements = [];
    for (let i = 0; i < 10; i++) {
      elements.push(testArr.popRandom());
    }
    elements.sort((x, y) => x - y);
    expect(elements).toEqual(testArrCopy);
  });
});

describe("Test Array.getMax", () => {
  var testArr, copy: number[];
  type comparator = (a: number, b: number) => number;
  var simpleComparator: comparator;
  beforeEach(() => {
    testArr = [];
    for (let i = 0; i < 10; i++) {
      testArr.push(i);
    }
    simpleComparator = jest.fn(function (a, b) {
      return a - b;
    });
    copy = testArr.map((x) => x);
  });

  test("Array not modified", () => {
    testArr.getMax(simpleComparator);
    expect(testArr).toEqual(copy);
  });
  test("Comparator is called", () => {
    testArr.getMax(simpleComparator);
    expect(simpleComparator).toBeCalledTimes(testArr.length);
  });
  test("Correct elements", () => {
    testArr.shuffle();
    var x = testArr.getMax(simpleComparator);
    expect(testArr).toContain(x);
    expect(copy[testArr.length - 1]).toEqual(x);

    testArr.shuffle();
    x = testArr.getMax((a, b) => b - a);
    expect(testArr).toContain(x);
    expect(x).toEqual(copy[0]);
  });
});

describe("Test Array.getAllMax", () => {
  var testArr: number[], copy: number[];
  type comparator = (a: number, b: number) => number;
  var simpleComparator: comparator;
  beforeEach(() => {
    testArr = [];
    for (let i = 0; i < 10; i++) {
      testArr.push(i);
    }
    simpleComparator = jest.fn(function (a, b) {
      return a - b;
    });
    copy = testArr.map((x) => x);
  });

  test("Array not modified", () => {
    testArr.getAllMax(simpleComparator);
    expect(testArr).toEqual(copy);
  });
  test("Comparator is called", () => {
    testArr.getAllMax(simpleComparator);
    expect(simpleComparator).toBeCalledTimes(testArr.length - 1);
  });
  test("Correct elements", () => {
    testArr.shuffle();
    var x = testArr.getAllMax(simpleComparator);
    expect(x).toBeInstanceOf(Array);
    expect(x.length).toEqual(1);
    expect(x[0]).toEqual(copy[copy.length - 1]);

    testArr.shuffle();
    x = testArr.getAllMax((a, b) => -1 * simpleComparator(a, b));
    expect(testArr).toContain(x[0]);
    expect(x.length).toEqual(1);
    expect(x[0]).toEqual(copy[0]);

    expect(simpleComparator).toBeCalledTimes((testArr.length - 1) * 2);

    testArr = testArr.concat(copy);
    x = testArr.getAllMax((a, b) => b - a);
    expect(testArr).toContain(x[0]);
    expect(x.length).toEqual(2);
    expect(x[0]).toEqual(copy[0]);
    expect(x[1]).toEqual(copy[0]);
  });
});
