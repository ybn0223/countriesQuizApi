import { NextApiRequest, NextApiResponse } from 'next';
import { USER_COLLECTION } from '../../database/database';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await USER_COLLECTION.updateMany({}, { $set: { highScoreWeekly: 0 } });
    res.status(200).send("Weekly leaderboard reset successfully!");
  } catch (error) {
    console.error("Error resetting leaderboard:", error);
    res.status(500).send("Error resetting leaderboard.");
  }
}