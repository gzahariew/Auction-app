import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Auction } from "./Auction";
import { User } from "./User";

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  timestamp: Date;

    // --- FOREIGN KEY 1: Auction the Bid belongs to ---
  // Many Bids belong to One Auction
  @ManyToOne(() => Auction, auction => auction.bids) // 'auction.bids' is the inverse relationship in the Auction entity
  @JoinColumn({ name: "auctionId" }) // This creates the 'auctionId' column in the 'bid' table
  auction: Auction; // This property will hold the full Auction object

  // --- FOREIGN KEY 2: User who placed the Bid ---
  // Many Bids are placed by One User
  @ManyToOne(() => User, user => user.bids) // 'user.bids' is the inverse relationship in the User entity
  @JoinColumn({ name: "userId" }) // This creates the 'userId' column in the 'bid' table
  user: User; // This property will hold the full User object
}
