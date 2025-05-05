import express from 'express';
import { deleteUser, registerUser, USER_COLLECTION } from '../database/database';



const DELETE_USER = express.Router();

DELETE_USER.post('/deleteAccount', async (req, res) => {
    const { email } = req.body;
    console.log('Received request:', req.body);

    try {
        const deleted = await deleteUser(email);
        if (!deleted) {
            return res.status(404).send('Error: user not found');
        }
        return res.status(200).send('User has been deleted successfully');
    } catch (error) {
        return res.status(500).send('Error: ' + error);
    }
});


export default DELETE_USER;