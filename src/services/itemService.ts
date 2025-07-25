import { Item, ItemBatch } from '../models/index';
import { db } from '../config/firebase';
import { collection, getDocs, getDoc, doc, DocumentData, QuerySnapshot, DocumentSnapshot, addDoc, setDoc } from 'firebase/firestore';

export class ItemService {
    private static readonly itemsCollection = 'items';

    /**
     * Fetch all items from the Firestore collection.
     * @returns Promise<Item[]> - Array of Item objects.
     */
    static async getAllItems(): Promise<Item[]> {
        try {
            // Reference to the collection
            const itemsCollection = collection(db, this.itemsCollection);
            
            // Fetch documents in collection
            const snap: QuerySnapshot<DocumentData> = await getDocs(itemsCollection);

            // Map documents to model
            const items: Item[] = [];
            snap.forEach((doc) => {
                const data = doc.data();
                
                // Convert batches with proper date handling
                const batches: ItemBatch[] = (data.batches || []).map((batchData: any) => ({
                    quantity: batchData.quantity || 0,
                    expirationDate: batchData.expirationDate ? batchData.expirationDate.toDate() : undefined,
                    purchaseDate: batchData.purchaseDate ? batchData.purchaseDate.toDate() : undefined,
                }));
                
                const item: Item = {
                    id: doc.id, 
                    name: data.name,
                    unit: data.unit,
                    minThreshold: data.minThreshold,
                    categoryIds: data.categoryIds || [],
                    batches: batches,
                    location: data.location,
                    notes: data.notes,
                    lastUpdate: data.lastUpdate ? data.lastUpdate.toDate() : new Date(),
                    updatedBy: data.updatedBy || '',
                };
                items.push(item);
            });
            return items;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw new Error('Failed to fetch items');
        }
    }

    /**
     * Calculate the total quantity of an item based on its batches.
     * @param item - The Item object to calculate total quantity for.
     * @returns number - Total quantity across all batches.
     */
    static getTotalQuantity(item: Item): number {
        return item.batches.reduce((total, batch) => total + (batch.quantity || 0), 0);
    }

    /**
     * Fetch a single item by its document ID.
     * @param id - The document ID of the item to fetch.
     * @returns Promise<Item | null> - The Item object or null if not found.
     */
    static async getItemById(id: string): Promise<Item | null> {
        try {
            // Get reference to the specific document
            const itemDoc = doc(db, this.itemsCollection, id);
            
            // Fetch the document
            const docSnap: DocumentSnapshot<DocumentData> = await getDoc(itemDoc);
            
            // Check if document exists
            if (!docSnap.exists()) {
                console.log('No item found with ID:', id);
                return null;
            }
            
            // Extract data from document
            const data = docSnap.data();
            
            // Convert batches with proper date handling (same as getAllItems)
            const batches: ItemBatch[] = (data.batches || []).map((batchData: any) => ({
                quantity: batchData.quantity || 0,
                expirationDate: batchData.expirationDate ? batchData.expirationDate.toDate() : undefined,
                purchaseDate: batchData.purchaseDate ? batchData.purchaseDate.toDate() : undefined,
            }));
            
            // Create and return Item object
            const item: Item = {
                id: docSnap.id,
                name: data.name,
                unit: data.unit,
                minThreshold: data.minThreshold,
                categoryIds: data.categoryIds || [],
                batches: batches,
                location: data.location,
                notes: data.notes,
                lastUpdate: data.lastUpdate ? data.lastUpdate.toDate() : new Date(),
                updatedBy: data.updatedBy || '',
            };
            
            return item;
        } catch (error) {
            console.error('Error fetching item by ID:', error);
            throw new Error('Failed to fetch item by ID');
        }
    }

    /**
     * Add a new item to the Firestore collection.
     * @param item - The Item object to add.
     * @returns Promise<void>
     */
    static async addItem(item: Item): Promise<void> {
        try {
            // Reference to the collection
            const itemsCollection = collection(db, this.itemsCollection);
            
            // Prepare item data
            const itemData: DocumentData = {
                name: item.name,
                unit: item.unit,
                minThreshold: item.minThreshold,
                categoryIds: item.categoryIds || [],
                batches: item.batches.map(batch => ({
                    quantity: batch.quantity || 0,
                    expirationDate: batch.expirationDate ? batch.expirationDate.toISOString() : null,
                    purchaseDate: batch.purchaseDate ? batch.purchaseDate.toISOString() : null,
                })),
                location: item.location,
                notes: item.notes,
                lastUpdate: new Date(),
                updatedBy: item.updatedBy,
            };
            
            // Add the item to the collection
            await addDoc(itemsCollection, itemData);
        } catch (error) {
            console.error('Error adding item:', error);
            throw new Error('Failed to add item');
        }
    }

    /**
     * Update an existing item in the Firestore collection.
     * @param id - The document ID of the item to update.
     * @param item - The updated Item object.
     * @returns Promise<void>
     */
    static async updateItem(id: string, item: Item): Promise<void> {
        try {
            // Get reference to the specific document
            const itemDoc = doc(db, this.itemsCollection, id);
            
            // Prepare updated item data
            const itemData: DocumentData = {
                name: item.name,
                unit: item.unit,
                minThreshold: item.minThreshold,
                categoryIds: item.categoryIds || [],
                batches: item.batches.map(batch => ({
                    quantity: batch.quantity || 0,
                    expirationDate: batch.expirationDate ? batch.expirationDate.toISOString() : null,
                    purchaseDate: batch.purchaseDate ? batch.purchaseDate.toISOString() : null,
                })),
                location: item.location,
                notes: item.notes,
                lastUpdate: new Date(),
                updatedBy: item.updatedBy,
            };
            
            // Update the document
            await setDoc(itemDoc, itemData, { merge: true });
        } catch (error) {
            console.error('Error updating item:', error);
            throw new Error('Failed to update item');
        }
    }

    /**
     * Delete an item from the Firestore collection.
     * @param id - The document ID of the item to delete.
     * @returns Promise<void>
     */
    static async deleteItem(id: string): Promise<void> {
        try {
            // Get reference to the specific document
            const itemDoc = doc(db, this.itemsCollection, id);
            
            // Delete the document
            await setDoc(itemDoc, {}, { merge: true });
        } catch (error) {
            console.error('Error deleting item:', error);
            throw new Error('Failed to delete item');
        }
    }
}