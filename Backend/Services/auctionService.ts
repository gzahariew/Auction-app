import { AppDataSource } from "../src/data-source";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/AppErr";
import { Auction } from "../src/entity/Auction";
import { User } from "../src/entity/User";
import { AuctionStatus } from "../types/enums";

class AuctionService {
  private auctionRepository = AppDataSource.getRepository(Auction);
  private userRepository = AppDataSource.getRepository(User);

  //Register Auction function
  async registerAuction(
    title: string,
    description: string,
    startPrice: number,
    startTime: Date,
    endTime: Date,
    sellerId: number // <--- IMPORTANT: Pass the ID of the seller
  ): Promise<Auction> {
    //Secure if the user exists and price is valid
    if (startTime >= endTime) {
      throw new BadRequestError("End time must be after start time.");
    }
    if (startPrice <= 0) {
      throw new BadRequestError("Start price must be positive.");
    }

    //Get the user ID
    const seller = await this.userRepository.findOneBy({ id: sellerId });
    if (!seller) {
      throw new BadRequestError("Seller not found."); // Or a more specific error
    }

    //Make the new auction with all the needed things
    const newAuction = this.auctionRepository.create({
      title,
      description,
      startPrice,
      currentPrice: startPrice,
      startTime,
      endTime,
      status: AuctionStatus.PENDING,
      seller: seller,
    });

    const savedAuction = await this.auctionRepository.save(newAuction);
    return savedAuction;
  }

  //GET all auctions currently
  async getAllAuctions(): Promise<Auction[]> {
    return this.auctionRepository.find();
  }

  //Service to get an Auction by ID
  async getAuctionById(id: number): Promise<Auction> {
    const auction = await this.auctionRepository.findOneBy({ id });

    if (!auction) {
      throw new NotFoundError("Error finding your call");
    } else {
      return auction;
    }
  }

  //Service to update an Auction by seller
  async updateAuction(
    auctionId: number,
    updateData: any,
    userId: number
  ): Promise<Auction> {
    const auction = await this.auctionRepository.findOneBy({ id: auctionId });

    if (!auction) {
      throw new NotFoundError(`Auction with ID ${auctionId} not found.`);
    }

    // --- AUTHORIZATION CHECK IN SERVICE ---
    if (auction.seller.id !== userId) {
      // Assuming auction.sellerId is the direct ID
      // If seller is a relation, it might be auction.seller.id
      throw new ForbiddenError(
        "You are not authorized to update this auction. Only the creator can."
      );
    }
    // --- END AUTHORIZATION CHECK ---

    // Update the auction properties (you might want specific fields only)
    Object.assign(auction, updateData);

    // Save the updated auction
    const updatedAuction = await this.auctionRepository.save(auction);
    return updatedAuction;
  }

  //Service to delete an auction only by seller
  async deleteAuction(auctionId: number, userId: number): Promise<void> {
    const auction = await this.auctionRepository.findOneBy({ id: auctionId });

    if (!auction) {
      throw new NotFoundError(`Auction with ID ${auctionId} not found.`);
    }

    // --- AUTHORIZATION CHECK IN SERVICE ---
    if (auction.seller.id !== userId) {
      // Assuming auction.sellerId
      throw new ForbiddenError(
        "You are not authorized to delete this auction. Only the creator can."
      );
    }
    // --- END AUTHORIZATION CHECK ---

    await this.auctionRepository.remove(auction);
  }
}

export const auctionService = new AuctionService();
