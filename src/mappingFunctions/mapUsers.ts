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
    city: user.city ? user.city : undefined,
    country: user.country ? user.country : undefined,
    aboutUser: user.about ? user.about : undefined,
    firstName: user.name ? user.name : undefined,
    lastName: user.surname ? user.surname : undefined,
    name: user.nick ? user.nick : undefined,
    yearOfBirth: user.birthyear ? user.birthyear.toString() : undefined,
    gender: user.gender === "m" ? "male" : user.gender === "f" ? "female" : undefined,
    v1LikedVehicles: bike_like
      .filter((like) => like.user_id === user.id)
      .map((like) => like.bike_id),
  }));
};
