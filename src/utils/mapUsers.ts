import { ObjectId } from "mongodb";
import type { IBikeLike } from "../types/oldDb/bike_like";
import { mapOldToNewCountries } from "../types/oldDb/user";
import type { IOldUser } from "../types/oldDb/user";
import type { IUser } from "../types/user";

interface MapUsersProps {
  isProduction?: boolean;
  oldUsers: IOldUser[];
  bike_like: IBikeLike[];
}

export const mapUsers = ({ isProduction, oldUsers, bike_like }: MapUsersProps) => {
  const prefix = isProduction ? "avatar" : "dev-avatar";
  return oldUsers.map<IUser>((user) => ({
    _id: new ObjectId(),
    v1Id: user.id,
    avatarImage: [`${prefix}-v1-${user.id}.jpg`], // check if file exist
    email: user.email,
    city: user.city ? user.city : undefined,
    country: user.country
      ? mapOldToNewCountries[user.country as keyof typeof mapOldToNewCountries]
      : undefined,
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
