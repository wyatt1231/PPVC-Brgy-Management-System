export interface YearlyPopulationModel {
  stat_year: number;
  alive: number;
  died: number;
}

export interface PopulationOfYearModel {
  population: number;
  deaths: number;
  male: number;
  female: number;
  infant: number;
  children: number;
  senior_citizen: number;
  pwd: number;
}

export interface AgeRangeModel {
  age_range?: string;
  total?: number;
}

export interface YearlyStatsModel {
  x: string | number;
  y: string | number;
}

export interface OverallPopulationModel {
  labels: Array<number>;
  death: Array<YearlyStatsModel>;
  alive: Array<YearlyStatsModel>;
}

export interface StatsModel {
  label: Array<string>;
  data: Array<YearlyStatsModel>;
  backgroundColor: Array<string>;
}

export interface DashboardFilterInterface {
  year: string;
  purok: Array<string>;
}
