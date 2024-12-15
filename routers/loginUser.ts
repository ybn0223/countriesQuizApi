import express from 'express';
import bcrypt from 'bcrypt';
import { USER_COLLECTION } from '../database/database';

const LOGIN_USER = express.Router();

LOGIN_USER.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const user = await USER_COLLECTION.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Respond with user data (excluding sensitive info like the password)
        const { email, profilePictureId } = user;
        return res.status(200).json({ username, email, profilePictureId });
    } catch (err) {
        console.error('Error logging in:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default LOGIN_USER;
