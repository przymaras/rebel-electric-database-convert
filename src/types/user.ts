import type { ObjectId } from "mongodb";

export interface IUserAccount {
  avatarImage?: string[];
  city?: string;
  country?: string;
  aboutUser?: string;
  email: string;
  firstName?: string;
  gender?: string;
  lastName?: string;
  name?: string;
  yearOfBirth?: string;
}
export interface IUser extends IUserAccount {
  _id?: ObjectId;
  v1Id?: number;
  badges?: string[];
  emailVerified?: Date;
  password?: string;
  profileLikesCount?: string;
  profileVehiclesCount?: string;
  profileViewsCount?: string;
  testsResults?: string;
  likedVehicles?: ObjectId[];
  v1LikedVehicles?: number[];
}

export interface IPassword {
  password: string;
  passwordRepeat: string;
}
