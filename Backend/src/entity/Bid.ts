import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auctionId: number;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column()
  timestamp: Date;
}
