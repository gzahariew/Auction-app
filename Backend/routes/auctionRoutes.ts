// src/routes/auctionRoutes.ts
import { Router } from 'express';
import { auctionController } from '../controllers/auctionController'; // Make sure the path is correct
import { authMiddleware } from '../middleware/authMiddleware'; // Make sure the path is correct

const router = Router();

// --- Public Routes (No authentication needed) ---
// GET /api/auctions - Get all auctions
router.get('/', auctionController.getAllAuctions);
// GET /api/auctions/:id - Get a specific auction by ID
router.get('/:id', auctionController.getAuctionById);

// POST /api/auctions - Create a new auction (requires authentication to know the seller)
router.post('/', authMiddleware, auctionController.createAuction);

// PUT /api/auctions/:id - Update an auction (requires authentication and creator authorization)
router.put('/:id', authMiddleware, auctionController.updateAuction);

// DELETE /api/auctions/:id - Delete an auction (requires authentication and creator authorization)
router.delete('/:id', authMiddleware, auctionController.deleteAuction);


export default router;