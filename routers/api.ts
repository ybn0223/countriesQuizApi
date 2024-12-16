import express from 'express';
import GET_COUNTRIES from './getCountries';
import PROFILE_PICTURE from './profilePicture';
import CREATE_USER from './createUser';
import LOGIN_USER from './loginUser';
import { updateHighScoreWeekly } from '../database/database';
import HIGH_SCORE_WEEKLY from './updateHighScore';
import LEADERBOARD from './getHighScoreWeekly';

const APIROUTER = express.Router();
	
APIROUTER.use('/', GET_COUNTRIES);
APIROUTER.use('/', PROFILE_PICTURE);
APIROUTER.use('/', CREATE_USER);
APIROUTER.use('/', LOGIN_USER);
APIROUTER.use('/', HIGH_SCORE_WEEKLY);
APIROUTER.use('/', LEADERBOARD);


export default APIROUTER;