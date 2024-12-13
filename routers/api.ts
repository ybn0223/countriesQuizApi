import express from 'express';
import GET_COUNTRIES from './getCountries';
import PROFILE_PICTURE from './profilePicture';
import USER_ROUTER from './user';

const APIROUTER = express.Router();
	
APIROUTER.use('/', GET_COUNTRIES);
APIROUTER.use('/', PROFILE_PICTURE);
APIROUTER.use('/', USER_ROUTER);


export default APIROUTER;