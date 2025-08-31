export type YearData = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  oil_co2?: number;
  temperature_change_from_co2?: number;
  total_ghg?: number;
  nitrous_oxide?: number;
};

export type CountryData = {
  iso_code?: string;
  region?: string;
  data: YearData[];
};

export type CO2Data = {
  [country: string]: CountryData;
};

export type SortOption = 'name-asc' | 'name-desc' | 'population';
