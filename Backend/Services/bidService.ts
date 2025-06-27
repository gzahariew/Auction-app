// src/services/bidService.ts
import { Bid } from "../src/entity/Bid";
import { Auction } from "../src/entity/Auction";
import { User } from "../src/entity/User";
import { AppDataSource } from "../src/data-source";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../errors/AppErr";
import { AuctionStatus } from "../types/enums"; // Assuming you have this enum
import { io } from "../server";
import { Timestamp } from "typeorm";

class BidService {
  private bidRepository = AppDataSource.getRepository(Bid);
  private auctionRepository = AppDataSource.getRepository(Auction);
  private userRepository = AppDataSource.getRepository(User);

  async placeBid(
    auctionId: number,
    bidAmount: number,
    userId: number
  ): Promise<Bid> {
    // 1. Fetch the auction with its seller and current bids
    // We need relations to check seller and current price, and bids for history if needed
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
      relations: ["seller"], // Load the seller to check if bidder is seller
    });

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!auction) {
      throw new NotFoundError(`Auction with ID ${auctionId} not found.`);
    }

    // 2. Fetch the bidder to link the entity
    const bidder = await this.userRepository.findOneBy({ id: userId });
    if (!bidder) {
      throw new NotFoundError(`Bidder with ID ${userId} not found.`);
    }

    // --- Core Bidding Validations ---

    // 3. Check if the bidder is the seller (seller cannot bid on their own auction)
    if (auction.seller.id === userId) {
      throw new ForbiddenError("Sellers cannot bid on their own auctions.");
    }

    // 4. Check if the auction is active/open for bidding
    if (auction.status !== AuctionStatus.ACTIVE) {
      // Assuming ACTIVE status for bidding
      throw new BadRequestError(
        `Auction is not active. Current status: ${auction.status}.`
      );
    }

    // 5. Check if the auction has ended
    const now = new Date();
    if (now >= auction.endTime) {
      throw new BadRequestError("This auction has already ended.");
    }

    // 6. Validate the bid amount
    if (bidAmount <= 0) {
      throw new BadRequestError("Bid amount must be positive.");
    }
    if (bidAmount <= auction.currentPrice) {
      // Assumes currentPrice is always updated
      throw new BadRequestError(
        `Your bid must be higher than the current price of ${auction.currentPrice}.`
      );
    }

    // --- All Validations Passed, Now Create and Update ---

    const newBid = this.bidRepository.create({
      amount: bidAmount,
      auctionId: auction.id, // Direct ID assignment
      userId: user.id, // Direct ID assignment (matching entity property name)
      timestamp: new Date(),
    });
    // 8. Save the new bid
    await this.bidRepository.save(newBid);

    io.to(auctionId.toString()).emit("auctionUpdate", {
      auctionId: auction.id,
      newPrice: auction.currentPrice,
      lastBidderId: bidder.id,
      // You can include more data relevant to the UI update
    });
    console.log(
      `Socket.IO: Emitted 'auctionUpdate' for auction ${auction.id}: New price ${auction.currentPrice}`
    );

    return newBid; // Return the newly created bid (or the updated auction, depends on preference)
  }
}

export const bidService = new BidService();
