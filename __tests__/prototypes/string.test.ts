require("../../src/utils/prototypes");
describe("Test string.formatString", () => {
  test("Correct type conversion", () => {
    var testString = "random string {0}";
    var correctString = "random string 1";
    expect(testString.formatString("1")).toEqual(correctString);
    expect(testString.formatString(1)).toEqual(correctString);

    correctString = "random string something";
    expect(testString.formatString("something")).toEqual(correctString);
  });

  test("Correct with multiple args", () => {
    const testString = "{0} random {1} {2} {1} string {0}";
    const correctString = "1 random 2 3 2 string 1";
    expect(testString.formatString(1, 2, 3)).toEqual(correctString);
  });
  test("Correct with array of args", () => {
    const testString = "{0} random {1} {2} {1} string {0}";
    const correctString = "1 random 2 3 2 string 1";
    expect(testString.formatString([1, 2, 3])).toEqual(correctString);
  });

  test("Not modified in case of no args", () => {
    const testString = "{0} random {1} {2} {1} string {0}";
    expect(testString.formatString()).toEqual(testString);
  });
});
