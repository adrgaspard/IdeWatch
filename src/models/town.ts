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

import {
  applyStatModifier,
  CitizenStats,
  StatModifier,
  StatMultiplier,
} from "./stats";

export interface TownHistory {
  readonly pandemonium: boolean;
  readonly gasGunBuildDay?: number;
  readonly guardRoomBuildDay?: number;
  readonly smallTrebuchetBuildDay?: number;
  readonly automaticSpriklersBuildDay?: number;
  readonly petShopBuildDay?: number;
  readonly filthyGuttersBuildDay?: number;
  readonly swedishWorkshopBuildDay?: number;
  readonly manualGrinderBuildDay?: number;
  readonly battlementsLevel3UpgradeDay?: number;
  readonly dumpLevel1UpgradeDay?: number;
  readonly dumpLevel2UpgradeDay?: number;
}

export interface TownContext {
  readonly pandemonium: boolean;
  readonly gasGunBuilt: boolean;
  readonly guardRoomBuilt: boolean;
  readonly smallTrebuchetBuilt: boolean;
  readonly automaticSpriklersBuilt: boolean;
  readonly petShopBuilt: boolean;
  readonly filthyGuttersBuilt: boolean;
  readonly swedishWorkshopBuilt: boolean;
  readonly manualGrinderBuilt: boolean;
  readonly battlementsUpgradedToLevel3: boolean;
  readonly dumpUpgradedToLevel1: boolean;
  readonly dumpUpgradedToLevel2: boolean;
}

export function getTownContextFromHistory(
  history: TownHistory,
  currentDay: never
): TownContext {
  return {
    pandemonium: history.pandemonium,
    gasGunBuilt:
      history.gasGunBuildDay !== undefined &&
      history.gasGunBuildDay <= currentDay,
    guardRoomBuilt:
      history.guardRoomBuildDay !== undefined &&
      history.guardRoomBuildDay <= currentDay,
    smallTrebuchetBuilt:
      history.smallTrebuchetBuildDay !== undefined &&
      history.smallTrebuchetBuildDay <= currentDay,
    automaticSpriklersBuilt:
      history.automaticSpriklersBuildDay !== undefined &&
      history.automaticSpriklersBuildDay <= currentDay,
    petShopBuilt:
      history.petShopBuildDay !== undefined &&
      history.petShopBuildDay <= currentDay,
    filthyGuttersBuilt:
      history.filthyGuttersBuildDay !== undefined &&
      history.filthyGuttersBuildDay <= currentDay,
    swedishWorkshopBuilt:
      history.swedishWorkshopBuildDay !== undefined &&
      history.swedishWorkshopBuildDay <= currentDay,
    manualGrinderBuilt:
      history.manualGrinderBuildDay !== undefined &&
      history.manualGrinderBuildDay <= currentDay,
    battlementsUpgradedToLevel3:
      history.battlementsLevel3UpgradeDay !== undefined &&
      history.battlementsLevel3UpgradeDay <= currentDay,
    dumpUpgradedToLevel1:
      history.dumpLevel1UpgradeDay !== undefined &&
      history.dumpLevel1UpgradeDay <= currentDay,
    dumpUpgradedToLevel2:
      history.dumpLevel2UpgradeDay !== undefined &&
      history.dumpLevel2UpgradeDay <= currentDay,
  };
}

export function getBuildingsModifier(town: TownContext): StatModifier {
  let total: CitizenStats = { survival: 0, defense: 0, wound: 0, terror: 0 };
  if (town.gasGunBuilt) {
    total = applyStatModifier(total, { terror: 0.1 });
  }
  if (town.guardRoomBuilt) {
    total = applyStatModifier(total, { survival: 0.05 });
  }
  if (town.battlementsUpgradedToLevel3) {
    total = applyStatModifier(total, { survival: 0.01 });
  }
  if (town.automaticSpriklersBuilt) {
    total = applyStatModifier(total, { survival: -0.04 });
  }
  return total;
}

export function getSmallTrebuchetMultiplier(town: TownContext): StatMultiplier {
  return town.smallTrebuchetBuilt ? { terror: 0 } : {};
}

export function getPandemoniumModifier(
  town: TownContext,
  survivalChance: number
): StatModifier {
  return town.pandemonium && survivalChance < 1
    ? { survival: -1 + survivalChance }
    : {};
}
