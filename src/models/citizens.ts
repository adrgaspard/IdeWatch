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
import { isValueInRange, Range } from "./range";
import { TownBaseData } from "./town";

export const CitizenBaseStats: CitizenStats = {
  survival: 0.92,
  defense: 10,
  wound: 0,
  terror: 0,
};

type CitizenCommonData = {
  readonly name: string;
  readonly tag: string;
  readonly eLevel: SuperLevel;
  readonly sLevel: SuperLevel;
  readonly job: Job;
};

export type CitizenBaseData = CitizenCommonData & {
  readonly deathDay?: number;
  readonly addictionDay?: number;
  readonly ghoulDays: Range;
  readonly bathOversightDays: Range;
  readonly showerOversightDays: Range;
};

export type CitizenDailyData = {
  readonly previousWatchDays: ReadonlyArray<number>;
  readonly statuses: ReadonlyArray<Status>;
  readonly items: ReadonlyArray<Item>;
  readonly drankYesterday: boolean;
};

export type CitizenContext = CitizenCommonData & {
  readonly dead: boolean;
  readonly previousBathDays: ReadonlyArray<number>;
  readonly tookShowerToday: boolean;
  readonly previousWatchDays: ReadonlyArray<number>;
  readonly statuses: ReadonlyArray<Status>;
  readonly items: ReadonlyArray<Item>;
};

export function getCitizenContextFromMixedData(
  base: CitizenBaseData,
  daily: CitizenDailyData,
  town: TownBaseData,
  currentDay: number
): CitizenContext {
  const dead = base.deathDay !== undefined ? base.deathDay < currentDay : false;
  const days: ReadonlyArray<number> = Array.from({ length: currentDay }, (_, i) => i + 1);
  const statuses = [...daily.statuses];
  if (isValueInRange(base.ghoulDays, currentDay)) {
    statuses.push(Status.Ghoul);
  }
  if (base.addictionDay !== undefined && base.addictionDay <= currentDay) {
    statuses.push(Status.Addict);
  }
  if (daily.drankYesterday) {
    statuses.push(Status.Hungover);
  }
  return {
    name: base.name,
    tag: base.tag,
    eLevel: base.eLevel,
    sLevel: base.sLevel,
    job: base.job,
    dead: dead,
    previousWatchDays: daily.previousWatchDays,
    previousBathDays:
      town.poolBuildDay !== undefined
        ? days.filter(
            day =>
              day >= town.poolBuildDay! &&
              (base.deathDay === undefined || base.deathDay >= day) &&
              !isValueInRange(base.bathOversightDays, day)
          )
        : [],
    statuses: dead ? [] : statuses,
    items: dead ? [] : daily.items,
    tookShowerToday:
      !dead &&
      town.showerBuildDay !== undefined &&
      currentDay >= town.showerBuildDay &&
      !isValueInRange(base.showerOversightDays, currentDay),
  };
}
