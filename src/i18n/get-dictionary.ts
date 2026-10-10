import { Locale, Dictionary } from "./config";
import { en } from "./dictionaries/en";
import { fa } from "./dictionaries/fa";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fa,
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale] || dictionaries.en;
};
