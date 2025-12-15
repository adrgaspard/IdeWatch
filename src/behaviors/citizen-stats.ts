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
import { CitizenBaseStats, CitizenContext } from "../models/citizens";
import { Jobs as JobsModifiers } from "../models/jobs";
import { applyStatModifier, applyStatMultiplier, CitizenStats } from "../models/stats";
import { SLevelSurvivalMalusEvolutions, SLevelModifiers } from "../models/super";
import { getBuildingsModifier, getPandemoniumModifier, getSmallTrebuchetMultiplier, TownContext } from "../models/town";
import { getPreviousBathsModifier, getShowerActionModifier } from "../models/baths-and-shower";
import { getPreviousWatchesModifier } from "../models/super";
import { getBaseTerrorAndWoundModifier } from "../models/terror-and-wound";
import { roundTo } from "../utils/general";
import { StatusModifiers } from "../models/statuses";
import { getItemModifier } from "../models/items";

export function getCitizenStats(town: TownContext, citizen: CitizenContext) {
  let stats: CitizenStats = { ...CitizenBaseStats };

  // Step 1 : Apply job modifier
  stats = applyStatModifier(stats, JobsModifiers[citizen.job]);

  // Step 2 : Apply previous watches modifier
  stats = applyStatModifier(stats, getPreviousWatchesModifier(citizen.previousWatchDays.length, citizen.sLevel));

  // Step 3 : Apply base terror and wound modifier
  stats = applyStatModifier(stats, getBaseTerrorAndWoundModifier(stats.survival, town.pandemonium));

  // Step 4 : Apply previous baths modifier
  stats = applyStatModifier(
    stats,
    getPreviousBathsModifier(
      citizen.previousBathDays,
      citizen.previousWatchDays,
      SLevelSurvivalMalusEvolutions[citizen.sLevel]
    )
  );
  let baseStats = { ...stats };

  // Step 5 : Apply items modifier
  for (const item of citizen.items) {
    stats = applyStatModifier(stats, getItemModifier(item, town));
  }

  // Step 6 : Apply statuses modifier
  for (const status of citizen.statuses) {
    const statusModifier = StatusModifiers[status];
    if (statusModifier !== undefined) {
      stats = applyStatModifier(stats, StatusModifiers[status]);
    }
  }

  // Step 7 : Apply buildings modifier
  stats = applyStatModifier(stats, getBuildingsModifier(town));

  // Step 8 : Apply shower action modifier
  stats = applyStatModifier(stats, getShowerActionModifier(citizen.tookShowerToday));

  // Step 9 : Apply pandemonium modifier
  stats = applyStatModifier(stats, getPandemoniumModifier(town, stats.survival));
  baseStats = applyStatModifier(baseStats, getPandemoniumModifier(town, baseStats.survival));

  // Step 10 : Apply super level modifier
  stats = applyStatModifier(stats, SLevelModifiers[citizen.sLevel]);
  baseStats = applyStatModifier(baseStats, SLevelModifiers[citizen.sLevel]);

  // Step 11 : Apply small trebuchet multiplier
  stats = applyStatMultiplier(stats, getSmallTrebuchetMultiplier(town));

  // Step 12 : Round survival chance
  return {
    ...stats,
    survival: roundTo(stats.survival, 4),
    baseSurvival: baseStats.survival,
  };
}
