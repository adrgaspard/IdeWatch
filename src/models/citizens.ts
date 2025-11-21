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
import { Job } from "./jobs";
import { Status } from "./statuses";
import { CitizenStats } from "./stats";
import { SuperLevel } from "./super";
import { Item } from "./items";

export const CitizenBaseStats: CitizenStats = {
  survival: 0.92,
  defense: 10,
  wound: 0,
  terror: 0,
};

export type CitizenBaseData = {
  readonly name: string;
  readonly tag?: string;
  readonly sLevel: SuperLevel;
  readonly job: Job;
};

export type CitizenContext = CitizenBaseData & {
  readonly previousWatchDays: ReadonlyArray<number>;
  readonly previousBathDays: ReadonlyArray<number>;
  readonly statuses: ReadonlyArray<Status>;
  readonly items: ReadonlyArray<Item>;
  readonly tookShowerToday: boolean;
};
