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

type OldCountriesType =
  | "Belgia"
  | "Niderlandy"
  | "Niemcy"
  | "Norwegia"
  | "Polska"
  | "Słowacja"
  | "Stany Zjednoczone"
  | "Szwecja"
  | "Ukraina"
  | "Wielka Brytania"
  | "Włochy";

export const mapOldToNewCountries: Record<OldCountriesType, string> = {
  Belgia: "BE",
  Niderlandy: "NL",
  Niemcy: "DE",
  Norwegia: "NO",
  Polska: "PL",
  Słowacja: "SK",
  "Stany Zjednoczone": "US",
  Szwecja: "SE",
  Ukraina: "UA",
  "Wielka Brytania": "GB",
  Włochy: "IT",
};
