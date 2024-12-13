import express from 'express';
import multer from 'multer';  // You can use multer for file handling
import { addProfilePicture, getProfilePicture, deleteProfilePicture, DB_NAME, USER_COLLECTION } from '../database/database';
import { ObjectId } from 'mongodb';

const PROFILE_PICTURE = express();
const upload = multer({ dest: 'uploads/' });  // Temporary file storage

// Endpoint to upload profile picture
PROFILE_PICTURE.post('/upload-profile-picture', upload.single('profilePic'), async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path, filename } = req.file;
    await addProfilePicture(userId, path, filename, res);
  } catch (err) {
    next(err);  // Pass the error to the global error handler
  }
});

// Endpoint to download profile picture
PROFILE_PICTURE.get('/get-profile-picture/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    // Check if the userId is a valid ObjectId format
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid UserId format' });
    }

    // Convert userId to ObjectId
    const OBJECTID = new ObjectId(userId);

    // Find the user and get the profilePictureId from the user's document
    const user = await USER_COLLECTION.findOne({ _id: OBJECTID });
	console.log(user);	


    if (!user) {
      console.log(`User with _id ${userId} not found.`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Found user: ${user.username}, Profile picture ID: ${user.profilePictureId}`);

    if (!user.profilePictureId) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    // Use the profilePictureId to get the profile picture from GridFS
    await getProfilePicture(userId ,res); // Pass the file ID and response
  } catch (err) {
    console.error('Error retrieving profile picture:', err);
    return res.status(500).json({ message: 'Error retrieving profile picture' });
  }
});

  

// Endpoint to delete profile picture
PROFILE_PICTURE.delete('/delete-profile-picture/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await deleteProfilePicture(userId, res);
  } catch (err) {
    next(err);  // Pass the error to the global error handler
  }
});

export default PROFILE_PICTURE;