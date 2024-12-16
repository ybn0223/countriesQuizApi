import express from 'express';
import {  updateHighScoreWeekly, USER_COLLECTION } from '../database/database';

const HIGH_SCORE_WEEKLY = express.Router();

HIGH_SCORE_WEEKLY.put('/update-highscore-weekly', async (req, res) => {
	const { username, highScoreWeekly } = req.body;
  
	if (!username || highScoreWeekly === undefined) {
	  return res.status(400).send('Error: Missing username or highScoreWeekly in request body');
	}
  
	try {
	  const result = await updateHighScoreWeekly(username, highScoreWeekly);
	  if (!result) {
		return res.status(400).send('Error: User not found or high score unchanged');
	  }
	  const user = await USER_COLLECTION.findOne({ username });
	  if (!user) {
		return res.status(400).send('Error: User not found after update');
	  }
	  return res.status(200).send('User high score updated successfully');
	} catch (error) {
	  console.error('Error in /update-highscore-weekly:', error);
	  return res.status(500).send('Error: ' + error);
	}
  });
  
  export default HIGH_SCORE_WEEKLY;