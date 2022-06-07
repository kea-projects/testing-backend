import { stringDateTime } from "../../src/utils/input-validators";
// ---------------------------- Test Cases -----------------------------
const validPartitions = [
  ["1000-01-01 00:00"],
  ["2021-12-24 23:59"],
  ["9999-12-31 23:59"],
];

const invalidPartitions = [
  ["999-01-01 00:00"],
  ["0999-01-01 00:00"],
  ["10000-01-01 00:00"],
  ["2022-06-03 25:15"],
  ["2022-13-15 12:24"],
  ["2022-11-31 13:15"], // there is no november 31
  ["1678-1-01 13:24"], // must have two digits for month
  ["1678-01-1 13:24"], // must have two digits for day
  ["2022-07-11 1:12"],
  ["2022-07-11 1:12"],
  ["1997-12-30 10:60"],
  ["1997-12-31 24:00"],
  [""],
  ["look at me, i'm a date!"],
  ["2022/06/03 20:44"],
];

// ---------------------------------- Tests -----------------------------------

describe("checks stringDate function", () => {
  test.each(validPartitions)("when the date is '%s' date should be valid", (validDate)=> {
    // Act
    const result = stringDateTime(validDate); 
    // Assert
    expect(result).not.toBeNull();
  });

  test.each(invalidPartitions)("when the date is '%s' date should be invalid", (invalidDate)=> {
    // Act
    const result = stringDateTime(invalidDate);
    // Assert
    expect(result).toBeNull();
  });
});