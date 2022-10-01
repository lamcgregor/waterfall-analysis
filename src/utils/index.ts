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
};

interface PositionedShareClass extends ShareClass {
  pos: number;
  capped: boolean;
  common: boolean;
}

export interface CalculatedShareClass extends PositionedShareClass {
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
  },
  {
    title: "Preferred A",
    shareCount: 200000,
    purchasePrice: 900000,
    cap: "1x participating, 2x cap",
  },
  {
    title: "Preferred B",
    shareCount: 300000,
    purchasePrice: 2100000,
    cap: "1x participating, 2x cap",
  },
  {
    title: "Preferred C",
    shareCount: 1500000,
    purchasePrice: 15000000,
    cap: "1x participating, 2x cap",
  },
];

const shouldInvestorConvert = ({ shareCount, purchasePrice, cap }: PositionedShareClass, totalCapital: number, totalShares: number) => {
  switch (cap) {
    case "1x participating, 2x cap":
      return purchasePrice * 2 <= totalCapital * ( shareCount / totalShares )
    default: return true
  }
};

const addPositions = (x: ShareClass[]): PositionedShareClass[] =>
  x.map((a, i) => ({
    ...a,
    pos: i + 1,
    capped: false,
    common: false,
  }));

export const formatCommaSeparated = (num: number) =>
  Number(num.toFixed(2)).toLocaleString("en");

export const calculateShareClass = (
  exitAmount: number
): CalculatedShareStructure => {
  let storedCapital = exitAmount;

  // Calculate total shares for creating percentages later
  const totalShares = shareStructure.reduce((total, shareClass) => total += shareClass.shareCount, 0);

  // Add positions (and flags) to data models
  const positionedShareClasses = addPositions(shareStructure);

  // Iterate over the investors in priority order
  // For each investor calculate if they should convert to common shares
  // If they should not, give them their assigned preference
  const convertedShareClasses: CalculatedShareClass[] = positionedShareClasses.slice(0).reverse()
    .map(shareClass => {
      const shouldConvert = shouldInvestorConvert(shareClass, storedCapital, totalShares);
      if (!shouldConvert) {
        const assignedValue = Math.min(storedCapital, shareClass.purchasePrice);
        // Give them their assigned preference
        storedCapital -= assignedValue
        return {
          ...shareClass,
          exitAmount: assignedValue,
        }
      }
      // Else note that this investor is converting to common
      return {
        ...shareClass,
        exitAmount: 0,
        common: true,
      };
    });

  // We store the shares left as when an investor caps and exits, the percentages need to change accordingly
  let sharesLeft = totalShares;

  // Iterate over the investors in closest to cap order, i.e. in lowest purchase value (of those who are capped);
  convertedShareClasses.sort((a, b) => a.cap === "1x participating, 2x cap" ? a.purchasePrice - b.purchasePrice : 1);

  // For each investor check if assigning their split from the remaining would cap them
  // If so assign their cap to them
  const cappedShareClasses: CalculatedShareClass[] = convertedShareClasses.map(shareClass => {
    const returnPercentage = shareClass.shareCount / sharesLeft;
    const calculatedReturn = Math.round(storedCapital * returnPercentage);
    // If the investor has not converted to common
    if (!shareClass.common) {
      // If the investor took their preference and would hit the cap
      if (shareClass.cap === "1x participating, 2x cap" && calculatedReturn > shareClass.purchasePrice) {
        // When an investor exits we remove their totals from the capital left
        storedCapital -= shareClass.purchasePrice;
        // And the share total
        sharesLeft -= shareClass.shareCount;
        return {
          ...shareClass,
          capped: true,
          exitAmount: shareClass.exitAmount + shareClass.purchasePrice
        }
      }
    }
    return shareClass;
  });

  // Now with the capped investors exited, split the remaining
  const calculatedShareClasses = cappedShareClasses.map(shareClass => splitRemaining(shareClass, sharesLeft, storedCapital));

  // Return them to their original order
  calculatedShareClasses.sort((a, b) => a.pos - b.pos);
  return {
    exitAmount: storedCapital,
    shareClasses: calculatedShareClasses,
  };
};

const splitRemaining = (shareClass: CalculatedShareClass, sharesLeft: number, storedCapital: number) => {
  const { shareCount, capped, exitAmount, common } = shareClass;
  const returnPercentage = shareCount / sharesLeft;
  const calculatedReturn = Math.round(storedCapital * returnPercentage);
  if(capped) return shareClass;
  // If the investor is not converting to common
  if (!common) {
    // Give them their return percentage (their stored, assigned preference + percentage)
    return {
      ...shareClass,
      exitAmount: exitAmount + calculatedReturn
    }
  }

  // Otherwise they get a simple percentage return
  return {
    ...shareClass,
    exitAmount: calculatedReturn
  }
}

