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

import { applyStatModifier, CitizenStats, StatModifier, StatMultiplier } from "./stats";

type TownCommonData = {
  readonly pandemonium: boolean;
  readonly poolBuildDay?: number;
  readonly showerBuildDay?: number;
};

export type TownBaseData = TownCommonData & {
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
};

export type TownContext = TownCommonData & {
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
};

export function getTownContextFromBaseData(base: TownBaseData, currentDay: number): TownContext {
  return {
    pandemonium: base.pandemonium,
    poolBuildDay: base.poolBuildDay,
    showerBuildDay: base.showerBuildDay,
    gasGunBuilt: base.gasGunBuildDay !== undefined && base.gasGunBuildDay <= currentDay,
    guardRoomBuilt: base.guardRoomBuildDay !== undefined && base.guardRoomBuildDay <= currentDay,
    smallTrebuchetBuilt: base.smallTrebuchetBuildDay !== undefined && base.smallTrebuchetBuildDay <= currentDay,
    automaticSpriklersBuilt:
      base.automaticSpriklersBuildDay !== undefined && base.automaticSpriklersBuildDay <= currentDay,
    petShopBuilt: base.petShopBuildDay !== undefined && base.petShopBuildDay <= currentDay,
    filthyGuttersBuilt: base.filthyGuttersBuildDay !== undefined && base.filthyGuttersBuildDay <= currentDay,
    swedishWorkshopBuilt: base.swedishWorkshopBuildDay !== undefined && base.swedishWorkshopBuildDay <= currentDay,
    manualGrinderBuilt: base.manualGrinderBuildDay !== undefined && base.manualGrinderBuildDay <= currentDay,
    battlementsUpgradedToLevel3:
      base.battlementsLevel3UpgradeDay !== undefined && base.battlementsLevel3UpgradeDay <= currentDay,
    dumpUpgradedToLevel1: base.dumpLevel1UpgradeDay !== undefined && base.dumpLevel1UpgradeDay <= currentDay,
    dumpUpgradedToLevel2: base.dumpLevel2UpgradeDay !== undefined && base.dumpLevel2UpgradeDay <= currentDay,
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

export function getPandemoniumModifier(town: TownContext, survivalChance: number): StatModifier {
  return town.pandemonium && survivalChance < 1 ? { survival: -1 + survivalChance } : {};
}
