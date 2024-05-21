export interface UserAccount {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    userApplications: UserApplication[];
}

export interface UserApplication {
    company_id: number;
    company_name: string;
}
