import { getBounded } from "../utils";
import { StatModifier } from "./stats";

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

export enum SuperLevel {
  None = 0,
  Beginner = 1,
  Apprentice = 2,
  Expert = 3,
  Master = 4,
}

export const SLevelModifiers: Readonly<Record<SuperLevel, StatModifier>> = {
  [SuperLevel.None]: {},
  [SuperLevel.Beginner]: { defense: 10 },
  [SuperLevel.Apprentice]: { defense: 10 },
  [SuperLevel.Expert]: { defense: 10 },
  [SuperLevel.Master]: { defense: 10, survival: 0.02 },
};

const malusBaseEvolution: ReadonlyArray<number> = [
  0, 0.01, 0.04, 0.09, 0.2, 0.3, 0.42, 0.56, 0.72, 0.9,
];
const malusProGuardEvolution: ReadonlyArray<number> = [
  0, 0.01, 0.04, 0.09, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 0.9,
];

export const SLevelSurvivalMalusEvolutions: Readonly<
  Record<SuperLevel, ReadonlyArray<number>>
> = {
  [SuperLevel.None]: malusBaseEvolution,
  [SuperLevel.Beginner]: malusBaseEvolution,
  [SuperLevel.Apprentice]: malusBaseEvolution,
  [SuperLevel.Expert]: malusProGuardEvolution,
  [SuperLevel.Master]: malusProGuardEvolution,
};

export function getPreviousWatchesModifier(
  previousWatchesCount: number,
  sLevel: SuperLevel
): StatModifier {
  return {
    survival: -getBounded(
      SLevelSurvivalMalusEvolutions[sLevel],
      previousWatchesCount
    ),
  };
}
