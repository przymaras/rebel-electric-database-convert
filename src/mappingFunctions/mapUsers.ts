import { ObjectId } from "mongodb";
import { IBikeLike } from "../types/oldDb/bike_like";
import { IOldUser } from "../types/oldDb/user";
import { IUser } from "../types/user";

interface MapUsersProps {
  oldUsers: IOldUser[];
  bike_like: IBikeLike[];
}

export const mapUsers = ({ oldUsers, bike_like }: MapUsersProps) => {
  return oldUsers.map<IUser>((user) => ({
    _id: new ObjectId(),
    v1Id: user.id,
    avatarImage: [`${user.id}.jpg`], // check if file exist
    email: user.email,
    city: user.city,
    country: user.country,
    aboutUser: user.about,
    firstName: user.name,
    lastName: user.surname,
    name: user.nick,
    yearOfBirth: user.birthyear.toString(),
    gender: user.gender === "m" ? "male" : user.gender === "f" ? "female" : "",
    v1LikedVehicles: bike_like
      .filter((like) => like.user_id === user.id)
      .map((like) => like.bike_id),
  }));
};
