import { randomInt } from "../../src/utils/utils";

describe("Test randomInt", () => {
  const testArr = [];
  for (let i = 0; i < 300; i++) {
    testArr.push(randomInt(0, 10));
  }
  const testArrDefaultParam = [] 
    for (let i = 0; i < 300; i++) {
        testArrDefaultParam.push(randomInt(10));
    }
    test.each([["",testArr], ["(default param)",testArrDefaultParam]])("randomInt is inclusive %s", (name, testData) => {
    for (let i = 0; i <= 10; i++) {
      //Could fail if for some reason 300 randoms didn't yield all values
      expect(testData).toContain(i);
    }
  });
  test.each([["",testArr], ["(default param)",testArrDefaultParam]])("randomInt in range %s", (name, testData) => {
    testData.forEach((element) => {
      expect(0 <= element && element <= 10).toBe(true);
    });
  });
 
  });

