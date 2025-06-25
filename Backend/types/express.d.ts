declare namespace Express {
    export interface Request {
        user?: {
            id: number;
            email: string;
            role: string;
            // Add any other properties you include in your JWT payload
        };
    }
}
