import express from 'express';
import { registerUser, USER_COLLECTION } from '../database/database';



const CREATE_USER = express.Router();

CREATE_USER.post('/sign-up', async(req, res) =>{

	const { email, username, password } = req.body;

	try {
		const result = await registerUser(email, username, password);
		if (!result) {
			return res.status(400).send('Error: user has not been created');
		}
		const user = await USER_COLLECTION.findOne({username});
		if (!user) {
			return res.status(400).send('Error: user has not been found');
		}
		return res.status(200).send('User has been create successfully');
	} catch (error) {
		return res.status(404).send('Error: ' + error);
	}
});

export default CREATE_USER;