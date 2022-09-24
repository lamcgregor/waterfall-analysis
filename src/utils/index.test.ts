import { calculateShareClass } from ".";

describe("Utility tests", () => {
  describe("Calculate exit at 60m", () => {
    const calculated = calculateShareClass(60000000);
    it.each([
      [0, 20000000],
      [1, 4000000],
      [2, 6000000],
      [3, 30000000],
    ])(
      '"Returns the correct exitAmount for index %i which is: %i"',
      (index, exitAmount) => {
        expect(calculated.shareClasses[index].exitAmount).toEqual(exitAmount);
      }
    );
  });
  describe("Calculate exit at 25m", () => {
    const calculated = calculateShareClass(25000000);
    it.each([
      [0, 2333333],
      [1, 1366667],
      [2, 2800000],
      [3, 18500000],
    ])(
      '"Returns the correct exitAmount for index %i which is: %i"',
      (index, exitAmount) => {
        expect(calculated.shareClasses[index].exitAmount).toEqual(exitAmount);
      }
    );
  });
  describe("Calculate exit at 35m", () => {
    const calculated = calculateShareClass(35000000);
    it.each([
      [0, 5750000],
      [1, 1800000],
      [2, 3825000],
      [3, 23625000],
    ])(
      '"Returns the correct exitAmount for index %i which is: %i"',
      (index, exitAmount) => {
        expect(calculated.shareClasses[index].exitAmount).toEqual(exitAmount);
      }
    );
  });
  describe("Calculate exit at 45m", () => {
    const calculated = calculateShareClass(45000000);
    it.each([
      [0, 9560000],
      [1, 1910000],
      [2, 4200000],
      [3, 29300000],
    ])(
      `Returns the correct exitAmount for index %i which is: %i`,
      (index, exitAmount) => {
        expect(calculated.shareClasses[index].exitAmount).toEqual(exitAmount);
      }
    );
  });
  describe("Calculate exit at 20m", () => {
    const calculated = calculateShareClass(16000000);
    it.each([
      [0, 0],
      [1, 0],
      [2, 1000000],
      [3, 15000000],
    ])(
      '"Returns the correct exitAmount for index %i which is: %i"',
      (index, exitAmount) => {
        expect(calculated.shareClasses[index].exitAmount).toEqual(exitAmount);
      }
    );
  });
});
