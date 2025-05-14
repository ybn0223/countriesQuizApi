import { stringify } from "querystring";
import { ICountry } from "../models/ICountry";
import { IPopulationModel } from "../models/IPopulationApiModel";

let ALLCOUNTRIES : ICountry[] = require('../json/countries.json');
import fs from 'fs';

const NINJA_KEY = process.env.NINJA_API_KEY ?? "";

const delay = () => new Promise(r => setTimeout(r, 350));

async function changePopulationValue(){
	const VALIDCOUNTRIES = ALLCOUNTRIES.filter(
		(country) => country.name && country.population
	);
	for (let i = 0; i < VALIDCOUNTRIES.length; i++) {
		const currentCountryResponse = await fetch(`https://api.api-ninjas.com/v1/population?country=${VALIDCOUNTRIES[i].name}`,{
			headers:{
				'X-Api-Key': NINJA_KEY
			}
		}
		)
		if(currentCountryResponse.ok) {
			const CurrentCountry : IPopulationModel = await currentCountryResponse.json();
			VALIDCOUNTRIES[i].population = CurrentCountry.historical_population[0].population;
		}
		console.log(VALIDCOUNTRIES[i].name);
		await delay();
	}
	fs.writeFile('newCountries.json', JSON.stringify(VALIDCOUNTRIES), function(err){
		if (err) throw err;
	})
	console.log("FINISHED!")
}