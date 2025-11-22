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
import {
  MatrixInput,
  lineInputTo,
  cellInputToString,
  cellInputToNumericEnum,
  cellInputToStringEnum,
  mapCellInput,
  cellInputToNumber,
  orUndefined,
  cellInputToRange,
  orThrow,
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

export function lineInputToCitizenBaseData(line: MatrixInput): CitizenBaseData {
  return lineInputTo(line, 10, fields => ({
    name: mapCellInput(fields[0], cellInputToString, () => orThrow("Citizen name should be filled.")),
    tag: mapCellInput(fields[1], cellInputToString, () => orThrow("Citizen tag should be filled.")),
    eLevel: cellInputToNumericEnum(fields[2], SuperLevel),
    sLevel: cellInputToNumericEnum(fields[3], SuperLevel),
    job: cellInputToStringEnum(fields[4], Job, getGlobalizedJobName),
    deathDay: mapCellInput(fields[5], cellInputToNumber, orUndefined),
    dependanceDay: mapCellInput(fields[6], cellInputToNumber, orUndefined),
    ghoulDays: cellInputToRange(fields[7]),
    bathOversightDays: cellInputToRange(fields[8]),
    showerOversightDays: cellInputToRange(fields[9]),
  }));
}
