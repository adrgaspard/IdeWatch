import { ConstructionSite, ConstructionSiteUpgrade } from "./construction-sites";

export interface TownHistory {
  readonly pandemonium: boolean;
}

export interface TownContext {
  readonly pandemonium: boolean;
  readonly constructionSites: ReadonlySet<ConstructionSite>;
  readonly constructionSiteUpgrades: ReadonlySet<ConstructionSiteUpgrade>;
}
