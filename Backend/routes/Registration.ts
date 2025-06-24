// src/routes/userRoutes.ts
import { Router } from 'express'; // <--- You import Router here!
import { userController } from '../controllers/Registration';

const router = Router(); // <--- You create an instance of Router here!

router.post('/register', userController.registerUser); // You define routes on this router instance

export default router; // You export the router instance