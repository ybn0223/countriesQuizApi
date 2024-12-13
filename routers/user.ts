import express from 'express';
import { createUser } from '../database/database';

const USER_ROUTER = express.Router();

USER_ROUTER.post('/create-user', async (req, res) =>{
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		return res.status(400).json({ message: 'UserId, name, email, and password are required.' });
	  }
	try {
		const RESULT = await createUser(username, email, password);
		res.status(200).send(RESULT);

	} catch (error) {
		res.status(400).send('Error: User was not created.')
	}
})

export default USER_ROUTER;