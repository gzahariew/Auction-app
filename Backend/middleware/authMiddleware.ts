import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config'; // Assuming you have your JWT_SECRET here

// Extend the Express Request type to include a 'user' property
// This is a good practice for TypeScript to recognize req.user
declare global {
    namespace Express {
        interface Request {
            user?: { id: number; email: string; role: string };
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        // Just send the response; do NOT return res.status()...
        res.status(401).json({ message: 'No token, authorization denied' });
        return; // Important: Add a return here to stop execution in this branch
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: number; email: string; role: string };

        // Attach the decoded user payload to the request
        req.user = decoded; // TypeScript will now understand `req.user` due to the declaration merge

        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        // Just send the response; do NOT return res.status()...
        res.status(401).json({ message: 'Token is not valid' });
        return; // Important: Add a return here to stop execution in this branch
    }
};