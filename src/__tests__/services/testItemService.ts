import { Item, ItemBatch } from '../../models';
import { testDb } from '../../config/firebase.test';
import { collection, getDocs, getDoc, doc, addDoc, deleteDoc, DocumentData, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';

export class TestItemService {
    private static readonly itemsCollection = 'items';

    /**
     * Clear all test data (use before each test)
     */
    static async clearTestData(): Promise<void> {
        const querySnapshot = await getDocs(collection(testDb, this.itemsCollection));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    }

    /**
     * Create test item data
     */
    static createTestItem(overrides?: Partial<Item>): Omit<Item, 'id'> {
        return {
            name: 'Test Toilet Paper',
            unit: 'rolls',
            minThreshold: 2,
            categoryIds: ['bathroom', 'essentials'],
            batches: [
                {
                    quantity: 5,
                    expirationDate: new Date('2024-12-31'),
                    purchaseDate: new Date('2024-01-01'),
                }
            ],
            location: 'upstairs bathroom',
            notes: 'Test item',
            lastUpdate: new Date(),
            updatedBy: 'TestUser',
            ...overrides,
        };
    }

    /**
     * Add a test item to Firestore emulator
     */
    static async addTestItem(itemData?: Partial<Item>): Promise<string> {
        const testItem = this.createTestItem(itemData);
        
        // Convert batches for Firestore
        const firestoreItem = {
            ...testItem,
            // Remove undefined fields for Firestore
            location: testItem.location || null,
            notes: testItem.notes || null,
            batches: testItem.batches.map(batch => ({
                quantity: batch.quantity,
                expirationDate: batch.expirationDate ? batch.expirationDate.toISOString() : null,
                purchaseDate: batch.purchaseDate ? batch.purchaseDate.toISOString() : null,
            })),
            lastUpdate: testItem.lastUpdate.toISOString(),
        };

        const docRef = await addDoc(collection(testDb, this.itemsCollection), firestoreItem);
        return docRef.id;
    }

    /**
     * Get all items from test database
     */
    static async getAllItems(): Promise<Item[]> {
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            collection(testDb, this.itemsCollection)
        );

        const items: Item[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert batches with proper date handling
            const batches: ItemBatch[] = (data.batches || []).map((batchData: any) => ({
                quantity: batchData.quantity || 0,
                expirationDate: batchData.expirationDate ? new Date(batchData.expirationDate) : undefined,
                purchaseDate: batchData.purchaseDate ? new Date(batchData.purchaseDate) : undefined,
            }));
            
            const item: Item = {
                id: doc.id,
                name: data.name,
                unit: data.unit,
                minThreshold: data.minThreshold,
                categoryIds: data.categoryIds || [],
                batches: batches,
                location: data.location === null ? undefined : data.location,
                notes: data.notes === null ? undefined : data.notes,
                lastUpdate: data.lastUpdate ? new Date(data.lastUpdate) : new Date(),
                updatedBy: data.updatedBy || '',
            };
            items.push(item);
        });
        
        return items;
    }

    /**
     * Get item by ID from test database
     */
    static async getItemById(id: string): Promise<Item | null> {
        const docSnap: DocumentSnapshot<DocumentData> = await getDoc(
            doc(testDb, this.itemsCollection, id)
        );

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        
        const batches: ItemBatch[] = (data.batches || []).map((batchData: any) => ({
            quantity: batchData.quantity || 0,
            expirationDate: batchData.expirationDate ? new Date(batchData.expirationDate) : undefined,
            purchaseDate: batchData.purchaseDate ? new Date(batchData.purchaseDate) : undefined,
        }));
        
        return {
            id: docSnap.id,
            name: data.name,
            unit: data.unit,
            minThreshold: data.minThreshold,
            categoryIds: data.categoryIds || [],
            batches: batches,
            location: data.location === null ? undefined : data.location,
            notes: data.notes === null ? undefined : data.notes,
            lastUpdate: data.lastUpdate ? new Date(data.lastUpdate) : new Date(),
            updatedBy: data.updatedBy || '',
        };
    }
}
