import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { AuctionStatus } from "../../types/enums";
import { User } from "./User";
import { Bid } from "./Bid";

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  startPrice: number;

  @Column()
  currentPrice: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({
    type: "text",
    enum: AuctionStatus,
    default: AuctionStatus.PENDING, // Assuming you have a default status
  })
  status: AuctionStatus;

  // --- FOREIGN KEY 1: Seller of the Auction ---
  // Many Auctions belong to One Seller (User)
  @ManyToOne(() => User, (user) => user.auctionsSold) // 'user.auctionsSold' is the inverse relationship in the User entity
  @JoinColumn({ name: "sellerId" }) // This explicitly creates the 'sellerId' column in the 'auction' table
  seller: User; // This property will hold the full User object

  // --- FOREIGN KEY 2: Winner of the Auction ---
  // Many Auctions have One Winner (User)
  @ManyToOne(() => User, (user) => user.auctionsWon) // 'user.auctionsWon' is the inverse relationship in the User entity
  @JoinColumn({ name: "winnerId" }) // This explicitly creates the 'winnerId' column in the 'auction' table
  winner: User; // This property will hold the full User object

  @OneToMany(() => Bid, (bid) => bid.auction) // 'bid.auction' points back to this Auction entity
  bids: Bid[]; // This will hold an array of Bid objects for this auction
}
