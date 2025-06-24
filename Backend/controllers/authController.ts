import { Request, Response, NextFunction } from "express";
import { userService } from "../Services/userService";
import { userWithoutPassword } from "../Helpers/NoPasswordRes";
import jwt from 'jsonwebtoken';
import { config } from '../config';

class AuthController {
    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const user = await userService.loginUser(email, password);

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: "Login successful!",
                user: userWithoutPassword(user),
                token: token,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController;