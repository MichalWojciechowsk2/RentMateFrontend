export interface City {
  name: string;
}

export const CITY_ID_TO_ENUM: Record<number, string> = {
  0: "Kraków",
  1: "Warszawa",
};

export interface District {
  // id: number;
  name: string;
}
