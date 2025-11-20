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
export enum State {
  Ghoul,
  Immune,
  Terror,
  Thirst,
  Dehydratation,
  Drugged,
  Addict,
  Infection,
  Drunk,
  Hungover,
  Wound,
  Healed,
}

export interface StateData {
  readonly survivalModifier: number;
  readonly defenseModifier: number;
}

export const States: Readonly<Record<State, StateData>> = {
  [State.Ghoul]: { survivalModifier: 0.05, defenseModifier: 0 },
  [State.Immune]: { survivalModifier: 0.01, defenseModifier: 0 },
  [State.Terror]: { survivalModifier: -0.05, defenseModifier: -30 },
  [State.Thirst]: { survivalModifier: 0, defenseModifier: -5 },
  [State.Dehydratation]: { survivalModifier: -0.03, defenseModifier: -10 },
  [State.Drugged]: { survivalModifier: 0, defenseModifier: 10 },
  [State.Addict]: { survivalModifier: -0.06, defenseModifier: 10 },
  [State.Infection]: { survivalModifier: -0.1, defenseModifier: -15 },
  [State.Drunk]: { survivalModifier: 0.02, defenseModifier: 15 },
  [State.Hungover]: { survivalModifier: -0.06, defenseModifier: -15 },
  [State.Wound]: { survivalModifier: -0.1, defenseModifier: -15 },
  [State.Healed]: { survivalModifier: -0.05, defenseModifier: -15 },
};
