require("../../src/utils/prototypes");

describe("Test array shuffle", () => {
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

describe("Test array getRandom", () => {
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
      testArr.forEach(element => {
          expect(elements).toContain(element)
      });
    });
});
