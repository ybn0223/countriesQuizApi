import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, GridFSBucket, ObjectId, GridFSBucketReadStream, Collection } from 'mongodb';  // Import ObjectId from mongodb
import fs from 'fs';
import { Request, Response } from 'express';  // Make sure you're importing Request and Response
import bcrypt from 'bcrypt';
import { error } from 'console';
import { IUser } from '../models/IUser.type';

dotenv.config();

const URI: string = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const CLIENT = new MongoClient(URI);


export const DB_NAME = 'Countries_Quiz_App';
export const DATABASE = CLIENT.db(DB_NAME);
export const USER_COLLECTION : Collection<IUser> = CLIENT.db(DB_NAME).collection('Users');

const BUCKET = new GridFSBucket(DATABASE, { bucketName: 'profilePictures' });

// Function to create a new user with hashed password
export async function createUser(name: string, email: string, password: string) {
	try {
	  // Hash the password using bcrypt
	  const hashedPassword = await bcrypt.hash(password, 10);
  
	  const newUser : IUser = {
		username: name,
		email: email,
		password: hashedPassword,  // Store the hashed password
		profilePictureId: null,  // Set profilePictureId to null if not provided
		createdAt: new Date(),
	  };
  
	  const result = await USER_COLLECTION.insertOne(newUser);
	  return {
		message: 'User created successfully',
		user: result.insertedId,
		name,
		email
	  };
	} catch (err) {
		throw error({ message: 'Internal server error' });
	}
  }

// Function to upload a profile picture to GridFS
export async function addProfilePicture(userId: string, filePath: string, fileName: string, res: Response) {
	try {
	  // Create an upload stream for GridFS
	  const uploadStream = BUCKET.openUploadStream(fileName);
	  const fileStream = fs.createReadStream(filePath);
	  
	  fileStream.pipe(uploadStream);
  
	  uploadStream.on('finish', async () => {
		try {
		  // Ensure the user exists and the profile picture ID is updated
		  const result = await USER_COLLECTION.updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: { profilePictureId: uploadStream.id } }
		  );
	  
		  if (result.matchedCount === 0) {
			console.log('No user found to update!');
			return res.status(404).json({ message: 'User not found' });
		  }
	  
		  if (result.modifiedCount === 0) {
			console.log('User profile picture ID was not updated!');
			return res.status(400).json({ message: 'Profile picture update failed' });
		  }
	  
		  console.log(`Successfully updated profile picture ID for user: ${userId}`);
	  
		  fs.unlinkSync(filePath);  // Clean up the uploaded file
	  
		  return res.status(200).json({ message: 'Profile picture uploaded and associated with user' });
		} catch (err) {
		  console.error('Error updating user profile with profile picture ID:', err);
		  return res.status(500).json({ message: 'Error updating profile picture' });
		}
	  });}
	  catch(err){
	  }};

// Function to download a profile picture from GridFS
export async function getProfilePicture(profilePictureId: string, res: any) {
	try {
	  const objectId = new ObjectId(profilePictureId);
  
	  // Check if the file exists in GridFS
	  const file = await DATABASE.collection('fs.files').findOne({ _id: objectId });
	  if (!file) {
		console.log(`File with ID ${profilePictureId} not found in GridFS`);
		return res.status(404).json({ message: 'Profile picture not found' });
	  }
  
	  // Create a readable stream and pipe it to the response
	  const downloadStream = BUCKET.openDownloadStream(objectId);
	  downloadStream.pipe(res);
	} catch (err) {
	  console.error('Error retrieving profile picture:', err);
	  res.status(500).json({ message: 'Error retrieving profile picture' });
	}
  }

// Function to delete a profile picture from GridFS (using async/await)
export async function deleteProfilePicture(userId: string, res: Response) {
  try {
    const userCollection = CLIENT.db(DB_NAME).collection('users');
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user || !user.profilePictureId) {
      return res.status(404).json({ message: 'User not found or no profile picture to delete' });
    }

    const fileId = user.profilePictureId;
    const objectId = new ObjectId(fileId);

    // Delete the file from GridFS
    const result = await BUCKET.delete(objectId);
    console.log('File deleted successfully!', result);

    // Optionally, you can also remove the profile picture reference from the user document
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { profilePictureId: "" } }
    );

    return res.status(200).json({ message: 'Profile picture deleted successfully!' });
  } catch (err) {
    console.error('Error while deleting profile picture:', err);
    return res.status(500).json({ message: 'Error while deleting profile picture' });
  }
}

// Function to connect to the database
export async function connect() {
  try {
    await CLIENT.connect();
    console.log("Connection with database started");
    process.on("SIGINT", exit); // Make sure to handle SIGINT for graceful exit
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

// Function to exit and close the connection
export async function exit() {
  try {
    await CLIENT.close();
    console.log("Disconnected from database");
  } catch (err) {
    console.error('Error closing database connection:', err);
  } finally {
    process.exit(0);
  }
}
