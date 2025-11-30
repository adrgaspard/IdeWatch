import { CellInput, cellToBoolean } from "../utils/parsing";

export function arrayToWatchSerie(elements: ReadonlyArray<CellInput>, firstDay: number): ReadonlyArray<number> {
  const watchArray = elements.map(cellToBoolean);
  const watchSerie = watchArray.map((watched, i) => (watched ? i + firstDay : undefined));
  return watchSerie.filter(day => day !== undefined);
}
