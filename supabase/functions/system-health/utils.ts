export function now(): number {

  return performance.now();

}

export function elapsed(start: number): number {

  return Math.round(

    performance.now() - start

  );

}

export function percentage(

  ok: number,

  total: number,

): number {

  if (total === 0) return 100;

  return Math.round(

    (ok / total) * 100

  );

}

export function countMissing(

  arr: unknown[]

): number {

  return arr.length;

}