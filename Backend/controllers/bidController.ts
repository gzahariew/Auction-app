// src/controllers/auctionController.ts
import { Request, Response, NextFunction } from "express";
import { bidService } from "../Services/bidService"; // <--- Import bidService

class BidController {

    async placeBid(req: Request, res: Response, next: NextFunction) {
        try {
            const auctionId = Number(req.params.id);
            const { amount } = req.body;
            const bidderId = (req as any).user!.id; // Get bidder ID from authenticated user

            // Call the bid service to place the bid
            const newBid = await bidService.placeBid(auctionId, amount, bidderId);

            // Send 201 Created for the new resource (the bid)
            res.status(201).json({
                message: "Bid placed successfully!",
                bid: newBid
            });
        } catch (error) {
            next(error); // Pass any errors to the central error middleware
        }
    }
}

export const bidController = new BidController();