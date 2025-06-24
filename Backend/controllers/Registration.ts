import { Request, Response, NextFunction } from "express";
import { userWithoutPassword } from "../Helpers/NoPasswordRes";
import { userService } from "../Services/userService";

class UserController {
    async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;

            const newUser = await userService.registerUser(username, email, password);

            // --- THIS IS THE LINE ---
            res.status(201).json(userWithoutPassword(newUser)); // Sends 201 status with user data (no password)
        } catch (error) {
            next(error); // Pass any errors to the central error middleware
        }
    }
}

export const userController = new UserController();