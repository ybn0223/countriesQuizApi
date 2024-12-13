export interface ICountry{
	abbreviation: string,
	capital: string,
	currency: string,
	name: string,
	phone: string,
	population: number,
	media: [
		flag: string,
		emblem: string,
		orthographic: string
	],
	id: number
}