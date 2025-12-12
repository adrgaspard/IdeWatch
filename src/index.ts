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

import { getCitizenStats } from "./behaviors/citizen-stats";
import { getCitizenContextFromMixedData } from "./models/citizens";
import { getTownContextFromBaseData } from "./models/town";
import { fixedArrayToCitizenBaseData } from "./parsers/citizen-parser";
import { fixedArrayToStatusesArray } from "./parsers/statuses-parser";
import { fixedArrayToTownBaseData } from "./parsers/town-parser";
import { arrayToWatchSerie } from "./parsers/watch-serie-parser";
import { fixedArrayToHeavyWeaponsArray, fixedArrayToLightWeaponsArray } from "./parsers/weapons-parser";
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
  // Step 1 : fetch citizen inputs from sheets
  const townBaseData = columnTo(townBaseDataColumn, 14, fixedArrayToTownBaseData);
  const citizensBaseData = linesToFixedArray(citizensBaseDataLines, 10, fixedArrayToCitizenBaseData);
  const currentDay = cellToInteger(currentDayCell);
  const planifiedWatches = linesToArray(planifiedWatchesLines, line => arrayToWatchSerie(line, 1));
  const statuses = Array.isArray(statusesLines)
    ? linesToFixedArray(statusesLines, 12, fixedArrayToStatusesArray)
    : Array(40).fill(Array(12).fill(false));
  const heavyWeapons = Array.isArray(heavyWeaponsLines)
    ? linesToFixedArray(heavyWeaponsLines, 15, fixedArrayToHeavyWeaponsArray)
    : Array(40).fill(Array(15).fill(false));
  const lightWeapons = lightWeaponsLines
    ? linesToFixedArray(lightWeaponsLines, 32, fixedArrayToLightWeaponsArray)
    : Array(40).fill(Array(32).fill(0));

  // Step 2 : aggregate inputs
  const townContext = getTownContextFromBaseData(townBaseData, currentDay);
  const citizenDailyDatas = planifiedWatches.map((watches, index) => ({
    previousWatchDays: watches,
    statuses: statuses[index],
    items: heavyWeapons[index].concat(lightWeapons[index]),
  }));
  const citizensContext = citizensBaseData.map((base, index) =>
    getCitizenContextFromMixedData(base, citizenDailyDatas[index], townContext, currentDay)
  );

  // Step 3 : compute citizens data
  const citizenStats = citizensContext.map(citizen => getCitizenStats(townContext, citizen));

  // Step 4 : format data for output
  return [
    citizenStats.map(x => x.baseSurvival),
    citizenStats.map(x => x.survival),
    citizenStats.map(x => x.wound),
    citizenStats.map(x => x.terror),
    citizenStats.map(x => x.defense),
  ]
    .flat()
    .map(x => [x]);
}

/**
 * Since we can't use the "export" keyword here, this console.log prevents
 * linter "not used" error with top level functions exported here.
 */
console.log({
  "Top level functions": [IdeWatch_checkCitizenBaseData, IdeWatch_checkTownBaseData, IdeWatch_getCitizensWatchDatas],
});
