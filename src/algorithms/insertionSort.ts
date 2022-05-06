export function insertionSort(numbers: number[]) {
  for (let i = 1; i < numbers.length; i++) {
    const current = numbers[i];
    let j = i - 1;
    while (j > -1 && current < numbers[j]) {
      numbers[j + 1] = numbers[j];
      j--;
    }
    numbers[j + 1] = current;
  }
  return numbers;
}
