import dotenv from 'dotenv';
import { MongoClient, Collection } from 'mongodb';  // Import ObjectId from mongodb
import bcrypt from 'bcrypt';
import { error } from 'console';
import { IUser } from '../models/IUser.type';

dotenv.config();

const URI: string = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const CLIENT = new MongoClient(URI);


export const DB_NAME = 'Countries_Quiz_App';
export const DATABASE = CLIENT.db(DB_NAME);
export const USER_COLLECTION : Collection<IUser> = CLIENT.db(DB_NAME).collection('Users');


export async function registerUser(email: string, username: string, password: string): Promise<string> {
	await connect();
    try {
        const userExists = await USER_COLLECTION.findOne({ username });
		const emailExists = await USER_COLLECTION.findOne({ email });
        if (userExists || emailExists) {
            return 'User already exists';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = {
            email,
            password: hashedPassword,
			username: username,
			profilePictureId: null
        };

        await USER_COLLECTION.insertOne(newUser);
        return 'User registered successfully';
    } catch (error) {
        console.error('Error registering user:', error);
        return 'Server error';
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
