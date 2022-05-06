import { shallowRef, watchEffect, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useRouteQuery(name: string, defaultValue?: string): Ref<string | undefined> {
  const router = useRouter();
  const route = useRoute();

  const currParamVal = route.query[name];
  let startingValue;
  if (currParamVal) {
    startingValue = `${currParamVal}`;
  }
  const param = shallowRef<string | undefined>(startingValue || defaultValue);

  watchEffect(() => {
    const queryCopy = { ...route.query };
    queryCopy[name] = `${param.value}`;
    router.replace({ query: queryCopy });
  });

  return param;
}
