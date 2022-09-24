type CapType =
  | "1x non-participating"
  | "1x participating, uncapped"
  | "1x participating, 2x cap"
  | "common";

type ShareClass = {
  shareCount: number;
  purchasePrice: number;
  cap: CapType;
  title: string;
  capped: boolean;
  pos: number;
};

export interface CalculatedShareClass extends ShareClass {
  shareCount: number;
  purchasePrice: number;
  cap: CapType;
  exitAmount: number;
  title: string;
}

export interface CalculatedShareStructure {
  exitAmount: number;
  shareClasses: CalculatedShareClass[];
}

const shareStructure: ShareClass[] = [
  {
    title: "Founders",
    shareCount: 1000000,
    purchasePrice: 0,
    cap: "common",
    capped: false,
    pos: 1,
  },
  {
    title: "Preferred A",
    shareCount: 200000,
    purchasePrice: 900000,
    cap: "1x participating, 2x cap",
    capped: false,
    pos: 2,
  },
  {
    title: "Preferred B",
    shareCount: 300000,
    purchasePrice: 2100000,
    cap: "1x participating, 2x cap",
    capped: false,
    pos: 3,
  },
  {
    title: "Preferred C",
    shareCount: 1500000,
    purchasePrice: 15000000,
    cap: "1x participating, 2x cap",
    capped: false,
    pos: 4,
  },
];

// TO DO Convert to common calculation
// Caps

export const calculateShareClass = (
  exitAmount: number
): CalculatedShareStructure => {
  let storedCapital = exitAmount;

  // We remove the base liquidation preferences first (investors initial purchase price)
  let calculatedShareClasses: CalculatedShareClass[] = shareStructure
    .slice(0)
    .reverse()
    .map((shareClass) => {
      const data = assignPreference(shareClass, storedCapital);

      // We ensure that the capital left is updated according to how much was assigned to the last investor
      storedCapital -= data.exitAmount;
      return data;
    });

  // If there is capital leftover we split the remaining according to share percentage
  if (storedCapital > 0) {
    calculatedShareClasses = capInvestors(
      calculatedShareClasses,
      storedCapital
    );
  }
  return {
    exitAmount: storedCapital,
    shareClasses: calculatedShareClasses.sort((a, b) => a.pos - b.pos),
  };
};

const assignPreference = (investor: ShareClass, storedCapital: number) => {
  // If there is less capital left than the initial purchase price, this investor takes the last of it
  if (investor.purchasePrice > storedCapital) {
    return {
      ...investor,
      exitAmount: storedCapital,
    };
  }

  // Otherwise they are temporarily returned their initial investment
  return {
    ...investor,
    exitAmount: investor.purchasePrice,
  };
};

const capInvestors = (
  investments: CalculatedShareClass[],
  storedCapital: number,
  checkCaps: boolean = true
): CalculatedShareClass[] => {
  // We calculate the total shares in the company
  const totalShares = investments.reduce(
    (total, x) => (total += x.shareCount),
    0
  );
  let capReached = !checkCaps; // Check if an investor would be capped by a weighted split
  let capitalToRemove = 0; // A store for the capped investors amounts to remove before recurring
  const uncappedInvestments = investments.map((investor) => {
    const returnPercentage =
      storedCapital * (investor.shareCount / totalShares); // Return amount based on share percentage
    if (checkCaps) {
      const isInvestorCapped = checkInvestorCap(
        investor.cap,
        returnPercentage,
        investor.purchasePrice
      );
      if (isInvestorCapped) {
        capReached = true;
        capitalToRemove += investor.purchasePrice;
      }
      return {
        ...investor,
        capped: isInvestorCapped,
        exitAmount: isInvestorCapped
          ? investor.purchasePrice + investor.exitAmount
          : investor.exitAmount, // Assign a percentage of the remaining capital to each investor according to their share ownership
      };
    }
    return {
      ...investor,
      exitAmount: Math.round(investor.exitAmount + returnPercentage),
    };
  });
  if (!checkCaps) return uncappedInvestments; // If we're dividing up the remaining don't recurse
  if (!capReached) {
    return [...capInvestors(uncappedInvestments, storedCapital, false)]; // If we didn't cap any investors, divide up the remaining
  }
  const cappedInvestors = uncappedInvestments.filter((x) => x.capped); // Filter capped and uncapped investors
  const remainingInvestors = uncappedInvestments.filter((x) => !x.capped);
  return [
    ...cappedInvestors,
    ...capInvestors(remainingInvestors, storedCapital - capitalToRemove),
  ];
};

const checkInvestorCap = (
  cap: CapType,
  currentReturn: number,
  initialInvestment: number
) => {
  switch (cap) {
    case "1x participating, 2x cap":
      return currentReturn > initialInvestment;
    default:
      return false;
  }
};

export const formatCommaSeparated = (num: number) =>
  Number(num.toFixed(2)).toLocaleString("en");
