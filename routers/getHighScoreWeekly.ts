import express from 'express';
import { USER_COLLECTION } from '../database/database';

const LEADERBOARD = express.Router();

// Route to fetch the weekly leaderboard
LEADERBOARD.get('/leaderboard-weekly', async (req, res) => {
  try {
    // Retrieve the top players sorted by their highScoreWeekly in descending order
	const leaderboard = await USER_COLLECTION.find({ highScoreWeekly: { $gte: 1 } }) // Only include scores >= 1
	.sort({ highScoreWeekly: -1 }) // Sort by highScoreWeekly in descending order
	.limit(30) // Limit to top 30 players
	.toArray();
  

    if (!leaderboard.length) {
      return res.status(404).send('No leaderboard data found');
    }

    // Map the results to include only the necessary fields
    const formattedLeaderboard = leaderboard.map((player, index) => ({
      rank: index + 1, // Add ranking
      username: player.username,
      profilePicture: player.profilePictureId || null, // Handle missing profile pictures
      highScoreWeekly: player.highScoreWeekly || 0, // Handle missing scores
    }));

    return res.status(200).json(formattedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).send('Error fetching leaderboard data');
  }
});

export default LEADERBOARD;
