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

/* eslint-disable @typescript-eslint/no-unused-vars */

import "./parsers/citizen-parser";
import { fixedArrayToCitizenBaseData } from "./parsers/citizen-parser";
import { fixedArrayToTownBaseData } from "./parsers/town-parser";
import { arrayToWatchSerie } from "./parsers/watch-serie-parser";
import {
  CellInput,
  MatrixInput,
  columnTo,
  lineTo,
  linesToFixedArray,
  cellToInteger,
  linesToArray,
} from "./utils/parsing";

function IdeWatch_checkCitizenBaseData(line: MatrixInput) {
  lineTo(line, 10, fixedArrayToCitizenBaseData);
  return "OK";
}

function IdeWatch_checkTownBaseData(column: MatrixInput) {
  columnTo(column, 14, fixedArrayToTownBaseData);
  return "OK";
}

function IdeWatch_getCitizensWatchDatas(
  townBaseDataColumn: MatrixInput,
  citizensBaseDataLines: MatrixInput,
  currentDayCell: CellInput,
  planifiedWatchesLines: MatrixInput,
  statusesLines: MatrixInput,
  heavyWeaponsLines: MatrixInput,
  lightWeaponsLines: MatrixInput
) {
  const townBaseData = columnTo(townBaseDataColumn, 14, fixedArrayToTownBaseData);
  const citizensBaseData = linesToFixedArray(citizensBaseDataLines, 10, fixedArrayToCitizenBaseData);
  const currentDay = cellToInteger(currentDayCell);
  const planifiedWatches = linesToArray(planifiedWatchesLines, line => arrayToWatchSerie(line, 1));
}

/**
 * Since we can't use the "export" keyword here, this console.log prevents
 * linter "not used" error with top level functions exported here.
 */
console.log({
  "Top level functions": [IdeWatch_checkCitizenBaseData, IdeWatch_checkTownBaseData, IdeWatch_getCitizensWatchDatas],
});
