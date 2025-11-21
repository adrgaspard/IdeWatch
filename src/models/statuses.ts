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
export enum Status {
  Ghoul = "Ghoul",
  Immune = "Immune",
  Terror = "Terror",
  Thirst = "Thirst",
  Dehydratation = "Dehydratation",
  Drugged = "Drugged",
  Addict = "Addict",
  Infection = "Infection",
  Drunk = "Drunk",
  Hungover = "Hungover",
  Wound = "Wound",
  Healed = "Healed",
  TamerGuard = "TamerGuard",
  TamerGuardSteak = "TamerGuardSteak",
}

export const StatusModifiers: Readonly<Record<Status, StatModifier>> = {
  [Status.Ghoul]: { survival: 0.05 },
  [Status.Immune]: { survival: 0.01 },
  [Status.Terror]: { survival: -0.05, defense: -30 },
  [Status.Thirst]: { defense: -5 },
  [Status.Dehydratation]: { survival: -0.03, defense: -10 },
  [Status.Drugged]: { defense: 10 },
  [Status.Addict]: { survival: -0.06, defense: 10 },
  [Status.Infection]: { survival: -0.1, defense: -15 },
  [Status.Drunk]: { survival: 0.02, defense: 15 },
  [Status.Hungover]: { survival: -0.06, defense: -15 },
  [Status.Wound]: { survival: -0.1, defense: -15 },
  [Status.Healed]: { survival: -0.05, defense: -15 },
  [Status.TamerGuard]: { survival: 0.02, defense: 10 },
  [Status.TamerGuardSteak]: { survival: 0.03, defense: 15 },
};
