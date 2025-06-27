import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config'; // Assuming you have your JWT_SECRET here

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: number; email: string; role: string }; // Cast decoded payload

        // Attach the decoded user payload to the request
        // Use 'as any' to tell TypeScript that 'req' has a 'user' property
        (req as any).user = decoded; // <--- CHANGE THIS LINE

        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};