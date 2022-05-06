export type Run = number[];

export function partitionRuns(numbers: number[], minRunLength: number) {
  const runsArray: Run[] = [];
  let currRun: Run = [];
  let mode: 'STRICTLYDECREASING' | 'INCREASING' | 'MINRUNLENGTH' | undefined;
  let lastNumber;
  for (const number of numbers) {
    if (lastNumber && !mode) {
      if (number >= lastNumber) {
        mode = 'INCREASING';
      } else if (number < lastNumber) {
        mode = 'STRICTLYDECREASING';
      }
    }

    if (lastNumber) {
      if (mode == 'INCREASING' && number < lastNumber) {
        mode = 'MINRUNLENGTH';
      } else if (mode == 'STRICTLYDECREASING' && number >= lastNumber) {
        mode = 'MINRUNLENGTH';
      }
    }

    if (mode == 'MINRUNLENGTH' && currRun.length >= minRunLength) {
      runsArray.push(currRun);
      mode = undefined;
      currRun = [];
    }
    currRun.push(number);
    lastNumber = number;
  }
  if (currRun.length > 0) {
    runsArray.push(currRun);
  }
  return runsArray;
}
