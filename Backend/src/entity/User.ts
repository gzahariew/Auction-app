import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auction } from "./Auction"; // <--- Import the Auction entity
import { Bid } from "./Bid";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ default: true })
  isActive: boolean; // <--- This MUST be explicitly typed as boolean

  // Inverse relationship for auctions this user has sold
  // This connects to the 'seller' property in the Auction entity.
  @OneToMany(() => Auction, (auction) => auction.seller)
  auctionsSold: Auction[]; // An array of auctions this user has created/sold

  // Inverse relationship for auctions this user has won
  // This connects to the 'winner' property in the Auction entity.
  @OneToMany(() => Auction, (auction) => auction.winner)
  auctionsWon: Auction[]; // An array of auctions this user has won

  @OneToMany(() => Bid, (bid) => bid.user) // 'bid.user' points back to this User entity
  bids: Bid[]; // This will hold an array of Bid objects placed by this user
}
