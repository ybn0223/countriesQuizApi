export interface IPopulationModel {
	country_name: string
	historical_population: Population[]
  }
  
  export interface Population {
	year: number
	population: number
	yearly_change_percentage: number
	yearly_change: number
	migrants: number
	median_age: number
	fertility_rate: number
	density: number
	urban_population_pct: number
	urban_population: number
	percentage_of_world_population: number
	rank: number
  }