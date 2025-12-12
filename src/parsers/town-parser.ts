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
import { ReadonlyFixedArray } from "../utils/general";
import { CellInput, cellToBoolean, cellToInteger, mapCell, orUndefined } from "../utils/parsing";

export function fixedArrayToTownBaseData(fields: ReadonlyFixedArray<CellInput, 14>) {
  return {
    pandemonium: cellToBoolean(fields[0]),
    gasGunBuildDay: mapCell(fields[1], cellToInteger, orUndefined),
    guardRoomBuildDay: mapCell(fields[2], cellToInteger, orUndefined),
    smallTrebuchetBuildDay: mapCell(fields[3], cellToInteger, orUndefined),
    automaticSpriklersBuildDay: mapCell(fields[4], cellToInteger, orUndefined),
    petShopBuildDay: mapCell(fields[5], cellToInteger, orUndefined),
    filthyGuttersBuildDay: mapCell(fields[6], cellToInteger, orUndefined),
    swedishWorkshopBuildDay: mapCell(fields[7], cellToInteger, orUndefined),
    manualGrinderBuildDay: mapCell(fields[8], cellToInteger, orUndefined),
    poolBuildDay: mapCell(fields[9], cellToInteger, orUndefined),
    showerBuildDay: mapCell(fields[10], cellToInteger, orUndefined),
    battlementsLevel3UpgradeDay: mapCell(fields[11], cellToInteger, orUndefined),
    dumpLevel1UpgradeDay: mapCell(fields[12], cellToInteger, orUndefined),
    dumpLevel2UpgradeDay: mapCell(fields[13], cellToInteger, orUndefined),
  };
}
