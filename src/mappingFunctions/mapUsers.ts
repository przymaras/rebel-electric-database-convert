import { IOldUser } from "../types/oldDb/user";
import { IUser } from "../types/user";

export const mapUsers = (oldUsers: IOldUser[]) => {
  return oldUsers.map<IUser>((user) => ({
    oldId: user.id,
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
  }));
};
