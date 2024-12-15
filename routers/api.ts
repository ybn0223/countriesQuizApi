import express from 'express';
import GET_COUNTRIES from './getCountries';
import PROFILE_PICTURE from './profilePicture';
import USER_ROUTER from './user';
import CREATE_USER from './createUser';

const APIROUTER = express.Router();
	
APIROUTER.use('/', GET_COUNTRIES);
APIROUTER.use('/', PROFILE_PICTURE);
APIROUTER.use('/', USER_ROUTER);
APIROUTER.use('/', CREATE_USER);


export default APIROUTER;