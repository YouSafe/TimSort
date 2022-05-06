import { deepCopy } from '@/utils/deepCopy';
import { mergeArrays } from './mergeSorted';
import type { Run } from './partitionRuns';

export interface Step {
  description: string;
  runStack: Run[];
}

export function timSort(runs: Run[]) {
  const stepsArray: Step[] = [];

  const runsStack: Run[] = [];

  stepsArray.push({
    description: 'start with empty stack',
    runStack: deepCopy(runsStack),
  });

  while (runs.length !== 0) {
    // remove first element and push onto the stack
    const currRun = runs.shift();
    if (currRun) {
      runsStack.unshift(currRun);
      stepsArray.push({
        description: 'push run on stack',
        runStack: deepCopy(runsStack),
      });
    }

    // balanced merging
    mergeCollapse(stepsArray, runsStack);
  }

  while (runsStack.length !== 1) {
    // merge both top runs on the stack
    if (runsStack[0] && runsStack[1]) {
      mergeStackElements(stepsArray, runsStack, 0, 'merge top two runs');
    } else {
      break;
    }
  }

  return stepsArray;
}

function mergeCollapse(stepsArray: Step[], R: Run[]) {
  while (R.length > 1) {
    if (R.length > 2 && R[2].length <= R[1].length + R[0].length) {
      if (R[2].length < R[0].length) {
        // at index 1 remove 2 and add merged
        mergeStackElements(stepsArray, R, 1, 'r3 < r1: merge 2 and 3');
      } else {
        // at index 0 remove 2 and add merged
        mergeStackElements(stepsArray, R, 0, 'r3 >= r1: merge 1 and 2');
      }
    } else if (R.length > 1 && R[1].length <= R[0].length) {
      // at index 0 remove 2 and add merged
      mergeStackElements(stepsArray, R, 0, 'r2 <= r1: merge 1 and 2');
    } else {
      break;
    }
  }
}

function mergeStackElements(stepsArray: Step[], runsStack: Run[], startHeight: number, description: string) {
  runsStack.splice(startHeight, 2, mergeArrays(runsStack[startHeight], runsStack[startHeight + 1]));
  stepsArray.push({
    description: description,
    runStack: deepCopy(runsStack),
  });
}
