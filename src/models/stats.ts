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

export type CitizenStats = {
  readonly survival: number;
  readonly defense: number;
  readonly wound: number;
  readonly terror: number;
};

export type StatModifier = Partial<CitizenStats>;

export type StatMultiplier = Partial<CitizenStats>;

export function applyStatModifier(
  base: CitizenStats,
  modifier: StatModifier
): CitizenStats {
  return {
    survival: base.survival + (modifier.survival ?? 0),
    defense: base.defense + (modifier.defense ?? 0),
    wound: base.wound + (modifier.wound ?? 0),
    terror: base.terror + (modifier.terror ?? 0),
  };
}

export function applyStatMultiplier(
  base: CitizenStats,
  multiplier: StatMultiplier
): CitizenStats {
  return {
    survival:
      multiplier.survival === undefined
        ? base.survival
        : base.survival * multiplier.survival,
    defense:
      multiplier.defense === undefined
        ? base.defense
        : base.defense * multiplier.defense,
    wound:
      multiplier.wound === undefined
        ? base.wound
        : base.wound * multiplier.wound,
    terror:
      multiplier.terror === undefined
        ? base.terror
        : base.terror * multiplier.terror,
  };
}
