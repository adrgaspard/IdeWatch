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
import { Status } from "../models/statuses";
import { ReadonlyFixedArray } from "../utils/general";
import { CellInput, cellToBoolean, mapCell, orFalse } from "../utils/parsing";

const StatusesOrder: ReadonlyFixedArray<Status, 12> = [
  Status.Drunk,
  Status.Thirst,
  Status.Dehydratation,
  Status.Terror,
  Status.Drugged,
  Status.Infection,
  Status.Wound,
  Status.Hungover,
  Status.Healed,
  Status.Immune,
  Status.TamerGuard,
  Status.TamerGuardSteak,
];

export function fixedArrayToStatusesArray(fields: ReadonlyFixedArray<CellInput, 12>) {
  return fields
    .map(x => mapCell(x, cellToBoolean, orFalse))
    .map((value, index) => (value ? StatusesOrder[index] : undefined))
    .filter(x => x !== undefined);
}
