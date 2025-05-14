import express from 'express';
import * as COUNTRIES from '../json/newCountries.json';

const GET_COUNTRIES = express.Router();

GET_COUNTRIES.get('/countries', async(req, res) =>{
	res.type('json').send(COUNTRIES);
});

export default GET_COUNTRIES;