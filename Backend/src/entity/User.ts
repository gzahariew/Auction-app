import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auction } from "./Auction"; // <--- Import the Auction entity

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Username: string;

  @Column()
  Email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  isActive: any;

      // Inverse relationship for auctions this user has sold
    // This connects to the 'seller' property in the Auction entity.
    @OneToMany(() => Auction, auction => auction.seller)
    auctionsSold: Auction[]; // An array of auctions this user has created/sold

    // Inverse relationship for auctions this user has won
    // This connects to the 'winner' property in the Auction entity.
    @OneToMany(() => Auction, auction => auction.winner)
    auctionsWon: Auction[]; // An array of auctions this user has won
}
