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
import { CitizenBaseData } from "../models/citizens";
import { Job } from "../models/jobs";
import { SuperLevel } from "../models/super";
import { ReadonlyFixedArray } from "../utils/general";
import {
  MatrixInput,
  lineTo,
  cellToString,
  cellToNumericEnum,
  cellToStringEnum,
  mapCell,
  cellToNumber,
  orUndefined,
  cellToRange,
  orThrow,
  CellInput,
} from "../utils/parsing";

function getGlobalizedJobName(value: string): string {
  switch (value) {
    case "Gardien":
    case "Guard":
      return Job.Guard;
    case "Apprivoiseur":
    case "Tamer":
      return Job.Tamer;
    case "Autre":
    case "Other":
      return Job.Other;
    default:
      return value;
  }
}

export function fixedArrayToCitizenBaseData(fields: ReadonlyFixedArray<CellInput, 10>) {
  return {
    name: mapCell(fields[0], cellToString, () => orThrow("Citizen name should be filled.")),
    tag: mapCell(fields[1], cellToString, () => orThrow("Citizen tag should be filled.")),
    eLevel: cellToNumericEnum(fields[2], SuperLevel),
    sLevel: cellToNumericEnum(fields[3], SuperLevel),
    job: cellToStringEnum(fields[4], Job, getGlobalizedJobName),
    deathDay: mapCell(fields[5], cellToNumber, orUndefined),
    dependanceDay: mapCell(fields[6], cellToNumber, orUndefined),
    ghoulDays: cellToRange(fields[7]),
    bathOversightDays: cellToRange(fields[8]),
    showerOversightDays: cellToRange(fields[9]),
  };
}
