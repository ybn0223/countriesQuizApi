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
