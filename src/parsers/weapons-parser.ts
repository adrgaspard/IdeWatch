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
import { Item, Items } from "../models/items";
import { ReadonlyFixedArray } from "../utils/general";
import { CellInput, cellToBoolean, cellToInteger, mapCell, orFalse, orZero } from "../utils/parsing";

const HeavyItems: ReadonlyFixedArray<Item, 15> = [
  Items.ShoppingTrolley,
  Items.Chainsaw,
  Items.StakeLauncher,
  Items.Lawnmower,
  Items.StinkingPig,
  Items.EmptyVendingMachine,
  Items.WaterCoolerBottle3,
  Items.KalashniSplash,
  Items.Mattress,
  Items.CarDoor,
  Items.ImpressivePumpkin,
  Items.RockingChair,
  Items.BeerFridge,
  Items.FlatpackedFurniture,
  Items.EktorpGlutenChair,
];

const LightItems: ReadonlyFixedArray<Item, 32> = [
  Items.Manbag,
  Items.UltraRucksack,
  Items.PocketBelt,
  Items.PsychadelicSpiritualCounsel,
  Items.ClaymoreMine,
  Items.FuriousKitten,
  Items.MangyDachshund,
  Items.JerrycanGun,
  Items.BurningLaserPointer4,
  Items.GuardDog,
  Items.SpyFlare,
  Items.Torch,
  Items.HumanFlesh,
  Items.ElectricWhisk,
  Items.Machete,
  Items.EasterEgg,
  Items.CollectorPins,
  Items.AquaSplash5,
  Items.ExplodingGrapefruit,
  Items.ExplodingWaterBomb,
  Items.GiantRat,
  Items.BatteryLauncherMkII,
  Items.SerratedKnife,
  Items.MakeshiftGuitar,
  Items.WaterBomb,
  Items.BatteryLauncher,
  Items.BoxCutter,
  Items.WaterPistol3,
  Items.PatheticPenknife,
  Items.BrokenHumanBone,
  Items.Taser,
  Items.BloodyHotCoffee,
];

export function fixedArrayToHeavyWeaponsArray(fields: ReadonlyFixedArray<CellInput, 15>) {
  return fields
    .map(x => mapCell(x, cellToBoolean, orFalse))
    .map((value, index) => (value ? HeavyItems[index] : undefined))
    .filter(x => x !== undefined);
}

export function fixedArrayToLightWeaponsArray(fields: ReadonlyFixedArray<CellInput, 32>) {
  return fields
    .map(x => mapCell(x, cellToInteger, orZero))
    .map((value, index) => (value > 0 ? Array(value).fill(LightItems[index]) : []))
    .flat();
}
