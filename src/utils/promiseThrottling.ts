export async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    console.info(`Processing batch ${index + 1} of ${array.length}`);
    await callback(array[index], index, array);
  }
}
export function split(arr: any[], n: number) {
  var res = [];
  while (arr.length) {
    res.push(arr.splice(0, n));
  }
  return res;
}
export const delayMS = (t = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(t);
    }, t);
  });
};
export const throttledPromises = (
  asyncFunction: any,
  items: any[] = [],
  batchSize: number = 1,
  delay: number = 0
) => {
  return new Promise<{ status: "fulfilled" | "rejected"; value?: any; reason?: any }[]>(
    async (resolve, reject) => {
      const output: any[] = [];
      const batches = split(items, batchSize);
      await asyncForEach(batches, async (batch: any[]) => {
        const promises = batch.map(asyncFunction); //.map((p: any) => p.catch(reject));
        const results = await Promise.allSettled(promises);
        output.push(...results);
        await delayMS(delay);
      });
      resolve(output);
    }
  );
};
