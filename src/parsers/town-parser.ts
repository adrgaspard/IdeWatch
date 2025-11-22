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
import { TownBaseData } from "../models/town";
import {
  cellInputToBoolean,
  cellInputToInteger,
  columnInputTo,
  mapCellInput,
  MatrixInput,
  orUndefined,
} from "../utils/parsing";

export function columnInputToTownBaseData(column: MatrixInput): TownBaseData {
  return columnInputTo(column, 14, fields => ({
    pandemonium: cellInputToBoolean(fields[0]),
    gasGunBuildDay: mapCellInput(fields[1], cellInputToInteger, orUndefined),
    guardRoomBuildDay: mapCellInput(fields[2], cellInputToInteger, orUndefined),
    smallTrebuchetBuildDay: mapCellInput(fields[3], cellInputToInteger, orUndefined),
    automaticSpriklersBuildDay: mapCellInput(fields[4], cellInputToInteger, orUndefined),
    petShopBuildDay: mapCellInput(fields[5], cellInputToInteger, orUndefined),
    filthyGuttersBuildDay: mapCellInput(fields[6], cellInputToInteger, orUndefined),
    swedishWorkshopBuildDay: mapCellInput(fields[7], cellInputToInteger, orUndefined),
    manualGrinderBuildDay: mapCellInput(fields[8], cellInputToInteger, orUndefined),
    poolBuildDay: mapCellInput(fields[9], cellInputToInteger, orUndefined),
    showerBuildDay: mapCellInput(fields[10], cellInputToInteger, orUndefined),
    battlementsLevel3UpgradeDay: mapCellInput(fields[11], cellInputToInteger, orUndefined),
    dumpLevel1UpgradeDay: mapCellInput(fields[12], cellInputToInteger, orUndefined),
    dumpLevel2UpgradeDay: mapCellInput(fields[13], cellInputToInteger, orUndefined),
  }));
}
