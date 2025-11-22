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
export type RangeChunk = {
  min: number;
  max: number;
};

export type Range = ReadonlyArray<RangeChunk>;

export function normalizeRange(range: Range): Range {
  if (range.length === 0) return [];
  const chunks = [...range].sort((a, b) => a.min - b.min);
  const merged: RangeChunk[] = [];
  for (const chunk of chunks) {
    if (merged.length === 0) {
      merged.push({ min: chunk.min, max: chunk.max });
      continue;
    }
    const last = merged[merged.length - 1];
    if (chunk.min <= last.max + 1) {
      last.max = Math.max(last.max, chunk.max);
    } else {
      merged.push({ min: chunk.min, max: chunk.max });
    }
  }
  return merged;
}

export function isValueInRange(range: Range, value: number): boolean {
  for (const chunk of range) {
    if (value >= chunk.min && value <= chunk.max) return true;
  }
  return false;
}

export function getAllIntegersInRange(range: Range): ReadonlyArray<number> {
  if (range.length === 0) return [];
  const result: number[] = [];
  for (const chunk of range) {
    const min = Math.ceil(chunk.min);
    const max = Math.floor(chunk.max);
    for (let value = min; value <= max; value++) {
      result.push(value);
    }
  }
  return result;
}
