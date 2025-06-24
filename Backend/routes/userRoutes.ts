// src/routes/userRoutes.ts
import { Router } from 'express'; // <--- You import Router here!
import { userController } from '../controllers/Registration';
import { authController } from '../controllers/authController';

const router = Router(); // <--- You create an instance of Router here!

router.post('/register', userController.registerUser); // You define routes on this router instance
router.post('/login', authController.loginUser)

export default router; // You export the router instance