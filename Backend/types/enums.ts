// src/types/AuctionStatus.ts (or similar)
export enum AuctionStatus {
    ACTIVE = "active",
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export enum Role {
    BUYERS = "buyer",
    SELLERS = "seller",
}