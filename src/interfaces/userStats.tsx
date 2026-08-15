import {GameModes} from "./gameModes.tsx";

// Types based on your schema
export interface CountryOut {
    iso2Code: string
    name: string
    flag: string // SVG string
    successRate: number
}

export interface CityOut {
    name: Array<string>
    country: CountryOut
    successRate: number
}

export interface DepartmentOut {
    name: string
    number: string
    successRate: number
}

interface UserStats {
    mostStrikes: number
    mostFailed: CountryOut | CityOut | DepartmentOut
    mostCorrectlyGuessed: CountryOut | CityOut | DepartmentOut
    successRate: number
}

export interface UserStatsByGameMode {
    gameMode: GameModes
    stats: UserStats
}
