import { ObjectId } from "mongodb"

export interface IUser{
	_id?: ObjectId,
	username: string,
	email: string,
	profilePictureId: ObjectId | null;
	password: string,
	highScoreWeekly: number | null
}