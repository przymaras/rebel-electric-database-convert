export interface IOldUser {
  id: number;
  acc_code: string;
  nick: string;
  email: string;
  password: string;
  subscription: "0" | "1";
  name: string;
  date: string;
  surname: string;
  country: string;
  city: string;
  gender: "m" | "f";
  birthyear: number;
  last_quiz_score: number;
  last_quiz_time: number;
  better_than: number;
  verif: number;
  fresh: "0" | "1";
  last_online: string;
  about: string;
  del_val: number;
}
