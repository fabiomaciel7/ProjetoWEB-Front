export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    password: string;
    isAdmin: boolean;
}