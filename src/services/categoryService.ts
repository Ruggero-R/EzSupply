import { db } from '../config/firebase';
import { collection, getDocs, DocumentData, QuerySnapshot } from 'firebase/firestore';
import type { Category } from '../models/category';

export class CategoryService {
    private static readonly COLLECTION = 'categories';
    private static categoryCache: Category[] | null = null;
    private static cacheTimestamp: number = 0;
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    /**
     * Fetch all categories from the Firestore collection.
     * @returns Promise<Category[]> - Array of Category objects.
     */
    static async getAllCategories(): Promise<Category[]> {
        const now = Date.now();
        
        // Use cached data if available and fresh
        if (this.categoryCache && (now - this.cacheTimestamp < this.CACHE_DURATION)) {
            // console.log('Using cached categories');
            return this.categoryCache;
        }

        try {
            console.log('Fetching categories from Firestore');
            const querySnapshot = await getDocs(collection(db, this.COLLECTION));
            
            const categories: Category[] = [];
            querySnapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    name: doc.data().name,
                    icon: doc.data().icon,
                });
            });

            // Update cache
            this.categoryCache = categories;
            this.cacheTimestamp = now;
            
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Failed to fetch categories');
        }
    }

   
    /**
     * @brief Retrieves categories that match the provided category IDs
     * @param categoryIds Array of category ID strings to filter by
     * @returns Promise that resolves to an array of Category objects matching the provided IDs
     * @throws May throw errors from getAllCategories() method
     */
    static async getCategoriesForItem(categoryIds: string[]): Promise<Category[]> {
        const allCategories = await this.getAllCategories();
        return allCategories.filter(category => categoryIds.includes(category.id));
    }

    /**
     * @brief Clears the category cache
     * @details This method resets the cached category data and timestamp.
     */
    static clearCache(): void {
        this.categoryCache = null;
        this.cacheTimestamp = 0;
    }
}