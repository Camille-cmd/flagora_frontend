interface LanguageValues {
    nativeName: string;
    flag: string;
}

export interface Languages {
    [code: string]: LanguageValues;
}
