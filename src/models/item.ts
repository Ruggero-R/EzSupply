export interface Item {
    id: string;
    name: string;
    unit: string;
    minThreshold: number;
    categoryIds: string[];
    batches: ItemBatch[];
    location?: string;
    notes?: string;
    lastUpdate: Date;
    updatedBy: string;
}

export interface ItemBatch {
    quantity: number;
    expirationDate?: Date;
    purchaseDate?: Date;
}