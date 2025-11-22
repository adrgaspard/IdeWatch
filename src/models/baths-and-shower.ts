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
import { getBounded } from "../utils/general";
import { StatModifier } from "./stats";

const bathSurvivalModifier = 0.01;

export function getPreviousBathsModifier(
  previousBathDays: ReadonlyArray<number>,
  previousWatchDays: ReadonlyArray<number>,
  malusEvolution: ReadonlyArray<number>
): StatModifier {
  const maxDay = Math.max(...previousWatchDays.concat(previousBathDays));
  let currentMalusIndex = 0;
  let currentMalus = 0;
  let effectiveBaths = 0;
  for (let day = 1; day <= maxDay; day++) {
    if (previousBathDays.includes(day) && currentMalus > 0) {
      currentMalus = Math.max(0, currentMalus - bathSurvivalModifier);
      effectiveBaths++;
    }
    if (previousWatchDays.includes(day)) {
      currentMalus -= getBounded(malusEvolution, currentMalusIndex);
      currentMalusIndex++;
      currentMalus += getBounded(malusEvolution, currentMalusIndex);
    }
  }
  return { survival: effectiveBaths * bathSurvivalModifier };
}

export function getShowerActionModifier(tookShower: boolean): StatModifier {
  return tookShower
    ? {
        terror: -0.025,
        wound: -0.025,
      }
    : {};
}
