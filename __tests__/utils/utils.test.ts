import { lookUpBasedOnKey, randomInt } from "../../src/utils/utils";
import { readFileSync } from "fs";
import path from "path";

describe("Test randomInt", () => {
  const testArr = [];
  for (let i = 0; i < 300; i++) {
    testArr.push(randomInt(0, 10));
  }
  const testArrDefaultParam = [];
  for (let i = 0; i < 300; i++) {
    testArrDefaultParam.push(randomInt(10));
  }
  test.each([
    ["", testArr],
    ["(default param)", testArrDefaultParam],
  ])("randomInt is inclusive %s", (name, testData) => {
    for (let i = 0; i <= 10; i++) {
      //Could fail if for some reason 300 randoms didn't yield all values
      expect(testData).toContain(i);
    }
  });
  test.each([
    ["", testArr],
    ["(default param)", testArrDefaultParam],
  ])("randomInt in range %s", (name, testData) => {
    testData.forEach((element) => {
      expect(0 <= element && element <= 10).toBe(true);
    });
  });
});

describe("Test lookUp", () => {
  const testData = JSON.parse(readFileSync(path.join(__dirname, "exampleGame.json"), "utf8"));
  const testArrDetective = testData[0].detectives;
  const testArrLocation = [];
  for (let x of testData) {
    testArrLocation.push(x.X.location);
  }
  test.each([
    ["(data: detectives)", testArrDetective],
    ["(data: locations)", testArrLocation],
  ])(" returns null %s", (name, testData) => {
    expect(lookUpBasedOnKey(testData, "something", 1)).toBeUndefined();
  });
  test.each([
    ["(data: detectives)", testArrDetective],
    ["(data: locations)", testArrLocation],
  ])("return correct value %s", (name, testData) => {
    if (name == "(data: detectives)") {
      expect(lookUpBasedOnKey(testData, "id", 1)).toEqual({
        role: "DETECTIVE",
        location: {
          label: "165",
          x: 600.1561279296875,
          y: 106.86906433105469,
          attributes: { "Computed Z-Level": "0" },
          color: "rgb(115, 0, 150)",
          size: 10,
          id: "165",
          "read_cam0:size": 8,
          "read_cam0:x": 444.34513232906954,
          "read_cam0:y": 111.38901351118193,
          "cam0:x": 1442.3451323290697,
          "cam0:y": 800.8890135111819,
          "cam0:size": 8,
        },
        id: 1,
        color: "rgb(115, 0, 150)",
        taxiTickets: 22,
        isPlayedByAI: true,
      });
      expect(lookUpBasedOnKey(testData, "color", "rgb(50, 154, 168)")).toEqual({
        role: "DETECTIVE",
        location: {
          label: "66",
          x: -255.203125,
          y: -224.16786193847656,
          attributes: { "Computed Z-Level": "0" },
          color: "rgb(50, 154, 168)",
          size: 10,
          id: "66",
          "read_cam0:size": 8,
          "read_cam0:x": -206.73608438743156,
          "read_cam0:y": -140.58923305064522,
          "cam0:x": 791.2639156125684,
          "cam0:y": 548.9107669493548,
          "cam0:size": 8,
        },
        id: 3,
        color: "rgb(50, 154, 168)",
        taxiTickets: 22,
        isPlayedByAI: true,
      });
    } else {
      expect(lookUpBasedOnKey(testData, "label", "97")).toEqual({
        label: "97",
        x: 236.94320678710938,
        y: -376.355224609375,
        attributes: { "Computed Z-Level": "0" },
        color: "rgb(0, 0, 0)",
        size: 10,
        id: "97",
        "read_cam0:size": 8,
        "read_cam0:x": 167.87520485158703,
        "read_cam0:y": -256.43100703890076,
        "cam0:x": 1165.8752048515871,
        "cam0:y": 433.06899296109924,
        "cam0:size": 8,
      });
      expect(lookUpBasedOnKey(testData, "label", "13")).toEqual({
        label: "13",
        x: -488.6977233886719,
        y: -396.98974609375,
        attributes: { "Computed Z-Level": "0" },
        color: "rgb(0, 0, 0)",
        size: 10,
        id: "13",
        "read_cam0:size": 8,
        "read_cam0:x": -384.46719174954944,
        "read_cam0:y": -272.13756461502373,
        "cam0:x": 613.5328082504506,
        "cam0:y": 417.36243538497627,
        "cam0:size": 8,
      });
    }
  });
});
