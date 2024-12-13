import express from 'express';

const PROFILE_PICTURE = express();

// Endpoint to upload profile picture
PROFILE_PICTURE.post('/upload-profile-picture', async (req, res, next) => {

});

// Endpoint to download profile picture
PROFILE_PICTURE.get('/get-profile-picture/:userId', async (req, res) => {
 
});

  

// Endpoint to delete profile picture
PROFILE_PICTURE.delete('/delete-profile-picture/:userId', async (req, res, next) => {
  
});

export default PROFILE_PICTURE;