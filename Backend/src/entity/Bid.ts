// src/entity/Bid.ts - CORRECTED

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"; // Ensure CreateDateColumn is imported for timestamp
import { Auction } from "./Auction";
import { User } from "./User";

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 }) // Best practice for monetary values
  amount: number;

  @CreateDateColumn() // Automatically sets the creation timestamp
  timestamp: Date;

  // --- FOREIGN KEY 1: Auction the Bid belongs to ---
  @ManyToOne(() => Auction, auction => auction.bids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "auctionId" }) // This specifies the column name in the DB
  auction: Auction; // This property will hold the full Auction object when loaded

  @Column() // <--- ADD THIS LINE
  auctionId: number; // <--- ADD THIS LINE: Explicitly declare the foreign key ID property


  // --- FOREIGN KEY 2: User who placed the Bid ---
  @ManyToOne(() => User, user => user.bids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" }) // This specifies the column name in the DB
  user: User; // This property will hold the full User object when loaded

  @Column() // <--- ADD THIS LINE
  userId: number; // <--- ADD THIS LINE: Explicitly declare the foreign key ID property
}