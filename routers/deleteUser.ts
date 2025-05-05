import express from 'express';
import { deleteUser, registerUser, USER_COLLECTION } from '../database/database';



const DELETE_USER = express.Router();

DELETE_USER.post('/deleteAccount', async(req, res) =>{

	const { email} = req.body;

	try {
		const result = await deleteUser(email);
		if (!result) {
			return res.status(400).send('Error: user has not been created');
		}
		const user = await USER_COLLECTION.findOne({email});
		if (!user) {
			return res.status(400).send('Error: user has not been found');
		}
		return res.status(200).send('User has been create successfully');
	} catch (error) {
		return res.status(404).send('Error: ' + error);
	}
});

export default DELETE_USER;