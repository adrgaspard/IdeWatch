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
import { lineInputToCitizenBaseData } from "./parsers/citizen-parser";
import { columnInputToTownBaseData } from "./parsers/town-parser";
import { MatrixInput } from "./utils/parsing";

function IdeWatch_checkCitizenBaseData(line: MatrixInput) {
  lineInputToCitizenBaseData(line);
  return "OK";
}

function IdeWatch_checkTownBaseData(column: MatrixInput) {
  columnInputToTownBaseData(column);
  return "OK";
}

/**
 * Since we can't use the "export" keyword here, this console.log prevents
 * linter "not used" error with top level functions exported here.
 */
console.log({ IdeWatch_checkCitizenBaseData, IdeWatch_checkTownBaseData });
