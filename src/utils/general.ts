/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type ReadonlyFixedArray<
  TItem,
  Length extends number,
  Accumulator extends readonly TItem[] = [],
> = Accumulator["length"] extends Length
  ? Accumulator
  : ReadonlyFixedArray<TItem, Length, readonly [...Accumulator, TItem]>;

export function roundTo(n: number, digits?: number): number {
  const negative = n < 0;
  if (digits === undefined) {
    digits = 0;
  }
  if (negative) {
    n = n * -1;
  }
  const multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = parseFloat((Math.round(n) / multiplicator).toFixed(digits));
  if (negative) {
    n = parseFloat((n * -1).toFixed(digits));
  }
  return n;
}

export function bound(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function getBounded<TData>(array: ReadonlyArray<TData>, index: number): TData {
  const boundedIndex = bound(index, 0, array.length - 1);
  return array[boundedIndex];
}
