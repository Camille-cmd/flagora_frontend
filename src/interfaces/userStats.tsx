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

interface UserStats {
    mostStrikes: number
    mostFailed: CountryOut | CityOut
    mostCorrectlyGuessed: CountryOut | CityOut
    successRate: number
}

export interface UserStatsByGameMode {
    gameMode: "GUESS_CAPITAL_FROM_COUNTRY" | "GUESS_COUNTRY_FROM_FLAG"
    stats: UserStats
}
