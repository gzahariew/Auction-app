// src/routes/auctionRoutes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { bidController } from '../controllers/bidController';

const router = Router();

// POST /api/auctions/:id/bid - Place a bid on an auction (requires authentication)
router.post('/:id/bid', authMiddleware, bidController.placeBid);

export default router;