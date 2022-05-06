<script setup lang="ts">
import { useRouteQuery } from '@/hooks/routerRef';
import { computed, ref } from 'vue';

const input = useRouteQuery('input', '');

const minRunLength = ref(3);

const runs = computed(() => {
  if (!input.value) {
    return [];
  }
  const numbers = input.value.split(',').map((val) => parseInt(val, 10));

  const runsArray = [] as number[][];
  let currRun = [] as number[];
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

    if (mode == 'MINRUNLENGTH' && currRun.length >= minRunLength.value) {
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
});

const insertionSort = (numbers: number[]) => {
  for (let i = 1; i < numbers.length; i++) {
    let current = numbers[i];
    let j = i - 1;
    while (j > -1 && current < numbers[j]) {
      numbers[j + 1] = numbers[j];
      j--;
    }
    numbers[j + 1] = current;
  }
  return numbers;
};

const mergeArrays = (a: number[], b: number[]) => {
  const sorted: number[] = [];
  while (a.length > 0 || b.length > 0) {
    if (a.length === 0) {
      for (const num of b) {
        sorted.push(num);
      }
      break;
    } else if (b.length === 0) {
      for (const num of a) {
        sorted.push(num);
      }
      break;
    } else {
      if (a[0] <= b[0]) {
        sorted.push(a[0]);
        a.shift();
      } else {
        sorted.push(b[0]);
        b.shift();
      }
    }
    console.log(sorted);
  }
  return sorted;
};

const deepCopy = (oldObject: object) => JSON.parse(JSON.stringify(oldObject));

const sortedRuns = computed(() => runs.value.map(insertionSort));

const steps = computed(() => {
  const stepsArray: { description: string; runStack: number[][] }[] = [];

  const runs = deepCopy(sortedRuns.value);
  const runsStack: number[][] = [];

  while (runs.length !== 0) {
    const currRun = runs.shift();
    if (currRun) {
      runsStack.unshift(currRun);
      stepsArray.push({
        description: 'push run',
        runStack: deepCopy(runsStack),
      });
    }

    // merge collapse
    while (runsStack.length > 1) {
      if (runsStack.length > 2 && runsStack[2].length <= runsStack[1].length + runsStack[0].length) {
        if (runsStack[2].length < runsStack[0].length) {
          // at index 1 remove 2 and add merged
          runsStack.splice(1, 2, mergeArrays(runsStack[1], runsStack[2]));
          stepsArray.push({
            description: 'r3 < r1: merge 2 and 3',
            runStack: deepCopy(runsStack),
          });
        } else {
          // at index 0 remove 2 and add merged
          runsStack.splice(0, 2, mergeArrays(runsStack[0], runsStack[1]));
          stepsArray.push({
            description: 'r3 >= r1: merge 1 and 2',
            runStack: deepCopy(runsStack),
          });
        }
      } else if (runsStack.length > 1 && runsStack[1].length <= runsStack[0].length) {
        // at index 0 remove 2 and add merged
        runsStack.splice(0, 2, mergeArrays(runsStack[0], runsStack[1]));
        stepsArray.push({
          description: 'r2 <= r1: merge 1 and 2',
          runStack: deepCopy(runsStack),
        });
      } else {
        break;
      }
    }
  }
  while (runsStack.length !== 1) {
    if (runsStack[0] && runsStack[1]) {
      runsStack.splice(0, 2, mergeArrays(runsStack[0], runsStack[1]));
      stepsArray.push({
        description: 'merge top two runs',
        runStack: deepCopy(runsStack),
      });
    } else {
      break;
    }
  }

  return stepsArray;
});
</script>

<template>
  <h1>Timsort</h1>
  <h2>Settings</h2>
  <div>
    <label for="input">Unsorted Array</label>
    <input v-model="input" id="input" />
    <label for="min-run-length">Min Run Length</label>
    <input v-model="minRunLength" id="min-run-length" />
  </div>
  <h2>Runs</h2>
  <div class="runs">
    <span v-for="(run, index) in runs" :key="index" class="run">
      <span v-for="(num, id) in run" :key="id" class="number"> {{ num }} </span>
    </span>
  </div>
  <h2>Sorted Runs</h2>
  <div class="runs">
    <span v-for="(run, index) in sortedRuns" :key="index" class="run">
      <span v-for="(num, id) in run" :key="id" class="number"> {{ num }} </span>
    </span>
  </div>
  <h2>Steps</h2>
  <div>
    <table>
      <thead>
        <th>Description</th>
        <th>Stack Frame</th>
      </thead>
      <tbody>
        <tr v-for="(step, index) in steps" :key="index">
          <td>{{ step.description }}</td>
          <td>{{ step.runStack }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.runs {
  display: flex;
}
.run {
  border: 1px solid blue;
  padding: 0.5em;
}
.number {
  margin: 0.25em;
}
</style>
