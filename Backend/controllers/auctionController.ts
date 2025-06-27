import { Request, Response, NextFunction } from "express";
import { auctionService } from "../Services/auctionService";
import { trace } from "console";

class AuctionController {
  //Create an Auction
  async createAuction(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, startPrice, startTime, endTime } = req.body;

      const sellerId = (req as any).user!.id;
      const newAuction = await auctionService.registerAuction(
        title,
        description,
        startPrice,
        startTime,
        endTime,
        sellerId
      );

      res.status(201).json(newAuction);
    } catch (error) {
      next(error);
    }
  }

  //Get all auctions controller
  async getAllAuctions(req: Request, res: Response, next: NextFunction) {
    try {
      const auctions = await auctionService.getAllAuctions();

      res.status(200).json(auctions);
    } catch (error) {
      next(error);
    }
  }

  //Get auction by id controller
  async getAuctionById(req: Request, res: Response, next: NextFunction) {
    try {
      const auctionId = Number(req.params.id);
      const auctionById = await auctionService.getAuctionById(auctionId);
      res.status(200).json(auctionById);
    } catch (error) {
      next(error);
    }
  }

  //Update an auction
  async updateAuction(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Get the auction ID from the URL parameters
      const auctionId = Number(req.params.id);

      const userId = (req as any).user!.id; // Use `!.id` as TypeScript knows `req.user` is present

      // 3. Get the update data from the request body
      //    req.body will contain the fields the client wants to update (e.g., { description: "new desc" })
      const updateData = req.body; // Consider using a DTO for stricter type checking here

      // 4. Call the service method to update the auction
      //    The service will handle:
      //    - Fetching the auction
      //    - Performing the ownership/authorization check
      //    - Applying the updates
      //    - Saving to the database
      const updatedAuction = await auctionService.updateAuction(
        auctionId,
        updateData,
        userId
      );

      // 5. Send a 200 OK status with the updated auction details
      res.status(200).json(updatedAuction);
    } catch (error) {
      // If any error occurs (e.g., NotFoundError, ForbiddenError from service, validation error),
      // pass it to the central error middleware
      next(error);
    }
  }

  async deleteAuction(req: Request, res: Response, next: NextFunction) {
    try {
      const auctionId = Number(req.params.id);

      const userId = (req as any).user!.id;

      await auctionService.deleteAuction(auctionId, userId);

      res.status(204).send;
    } catch (error) {
      next(error);
    }
  }
}

export const auctionController = new AuctionController();
