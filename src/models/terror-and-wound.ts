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
import { bound, roundTo } from "../utils";
import { StatModifier } from "./stats";

export function getBaseTerrorAndWoundModifier(
  baseSurvivalChance: number,
  isPandemonium: boolean
): StatModifier {
  const woundRatio = isPandemonium ? 0.3 : 0.2;
  const terrorRatio = isPandemonium ? 0.2 : 0.1;
  const woundChance = baseSurvivalChance - baseSurvivalChance * woundRatio;
  const terrorChance = baseSurvivalChance - baseSurvivalChance * terrorRatio;
  return {
    terror: roundTo(bound(terrorChance, 0, 1), 2),
    wound: roundTo(bound(woundChance, 0, 1), 2),
  };
}
