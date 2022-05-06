<script setup lang="ts">
import { insertionSort } from '@/algorithms/insertionSort';
import { partitionRuns } from '@/algorithms/partitionRuns';
import { timSort } from '@/algorithms/timSort';
import { useRouteQuery } from '@/hooks/routerRef';
import { deepCopy } from '@/utils/deepCopy';
import { computed, ref } from 'vue';

const input = useRouteQuery('input', '');
const minRunLength = ref(3);

const runs = computed(() => {
  if (!input.value) {
    return [];
  }
  const numbers = input.value.split(',').map((val) => parseInt(val, 10));

  return partitionRuns(numbers, minRunLength.value);
});

const sortedRuns = computed(() => deepCopy(runs.value).map(insertionSort));

const steps = computed(() => {
  const runs = deepCopy(sortedRuns.value);
  const stepsArray = timSort(runs);
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
          <td>
            <div class="stack" v-for="(item, ind) in step.runStack" :key="ind">
              <span class="number">
                <span class="stack-label">R[{{ ind + 1 }}]: </span
                ><span class="number" v-for="(num, id) in item" :key="id">{{ num }}</span>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: row;
}

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

table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid black;
}

.stack-label {
  font-weight: bold;
}
</style>
