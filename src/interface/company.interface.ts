export interface CompanyLocale {
    locale: string;
    is_default: boolean;
}

export interface CompanyRes {
    id: number;
    name: string;
    slug: string;
    timezone: string;
    locales: CompanyLocale[];
}
