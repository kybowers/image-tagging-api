declare namespace Express {
    export interface Request {
        decoded?: {
            username: string;
        };
    }
}
