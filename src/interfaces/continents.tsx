export type ContinentCode = "AF" | "AS" | "EU" | "NA" | "SA" | "OC";

export interface Continent {
    code: ContinentCode;
    name: string;
}

export const CONTINENTS: Continent[] = [
    {code: "AF", name: "Africa"},
    {code: "AS", name: "Asia"},
    {code: "EU", name: "Europe"},
    {code: "NA", name: "North America"},
    {code: "SA", name: "South America"},
    {code: "OC", name: "Oceania"},
];
