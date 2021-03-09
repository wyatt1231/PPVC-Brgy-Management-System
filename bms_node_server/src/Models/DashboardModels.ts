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
