import { TestItemService } from '../services/testItemService';

// Setup for database integration tests
const setupEmulatorTest = () => {
  beforeEach(async () => {
    // Clear test data before each test
    await TestItemService.clearTestData();
  });
};

describe('ItemService Integration Tests', () => {
  setupEmulatorTest();

  describe('Database Operations', () => {
    it('should create and retrieve an item', async () => {
      // Create a test item
      const itemId = await TestItemService.addTestItem({
        name: 'Test Shampoo',
        unit: 'bottles',
        minThreshold: 1,
        categoryIds: ['bathroom', 'personal-care'],
        location: 'shower',
      });

      expect(itemId).toBeDefined();
      expect(typeof itemId).toBe('string');

      // Retrieve the item
      const retrievedItem = await TestItemService.getItemById(itemId);
      
      expect(retrievedItem).toBeDefined();
      expect(retrievedItem?.id).toBe(itemId);
      expect(retrievedItem?.name).toBe('Test Shampoo');
      expect(retrievedItem?.unit).toBe('bottles');
      expect(retrievedItem?.minThreshold).toBe(1);
      expect(retrievedItem?.categoryIds).toEqual(['bathroom', 'personal-care']);
      expect(retrievedItem?.location).toBe('shower');
    });

    it('should handle items with multiple batches', async () => {
      const testItemData = {
        name: 'Test Milk',
        unit: 'cartons',
        minThreshold: 1,
        categoryIds: ['kitchen', 'dairy'],
        batches: [
          {
            quantity: 2,
            expirationDate: new Date('2024-01-15'),
            purchaseDate: new Date('2024-01-10'),
          },
          {
            quantity: 1,
            expirationDate: new Date('2024-01-20'),
            purchaseDate: new Date('2024-01-15'),
          },
        ],
      };

      const itemId = await TestItemService.addTestItem(testItemData);
      const retrievedItem = await TestItemService.getItemById(itemId);

      expect(retrievedItem?.batches).toHaveLength(2);
      expect(retrievedItem?.batches[0].quantity).toBe(2);
      expect(retrievedItem?.batches[1].quantity).toBe(1);
      
      // Check dates are properly converted
      expect(retrievedItem?.batches[0].expirationDate).toBeInstanceOf(Date);
      expect(retrievedItem?.batches[0].expirationDate?.getFullYear()).toBe(2024);
    });

    it('should retrieve all items', async () => {
      // Create multiple test items
      await TestItemService.addTestItem({ name: 'Item 1' });
      await TestItemService.addTestItem({ name: 'Item 2' });
      await TestItemService.addTestItem({ name: 'Item 3' });

      const allItems = await TestItemService.getAllItems();

      expect(allItems).toHaveLength(3);
      
      const itemNames = allItems.map(item => item.name);
      expect(itemNames).toContain('Item 1');
      expect(itemNames).toContain('Item 2');
      expect(itemNames).toContain('Item 3');
    });

    it('should return null for non-existent item', async () => {
      const nonExistentItem = await TestItemService.getItemById('non-existent-id');
      expect(nonExistentItem).toBeNull();
    });

    it('should handle items without batches', async () => {
      const itemId = await TestItemService.addTestItem({
        name: 'Simple Item',
        batches: [], // No batches
      });

      const retrievedItem = await TestItemService.getItemById(itemId);
      
      expect(retrievedItem?.batches).toEqual([]);
    });

    it('should handle items with optional fields undefined', async () => {
      const itemId = await TestItemService.addTestItem({
        name: 'Minimal Item',
        location: undefined,
        notes: undefined,
      });

      const retrievedItem = await TestItemService.getItemById(itemId);
      
      expect(retrievedItem?.name).toBe('Minimal Item');
      expect(retrievedItem?.location).toBeUndefined();
      expect(retrievedItem?.notes).toBeUndefined();
    });
  });

  describe('Date Handling', () => {
    it('should properly handle Date conversion for batches', async () => {
      const testDate = new Date('2024-06-15T10:30:00Z');
      
      const itemId = await TestItemService.addTestItem({
        name: 'Date Test Item',
        batches: [
          {
            quantity: 1,
            expirationDate: testDate,
            purchaseDate: testDate,
          },
        ],
      });

      const retrievedItem = await TestItemService.getItemById(itemId);
      
      expect(retrievedItem?.batches[0].expirationDate).toBeInstanceOf(Date);
      expect(retrievedItem?.batches[0].purchaseDate).toBeInstanceOf(Date);
      
      // Note: Firestore might lose milliseconds, so compare date strings
      expect(retrievedItem?.batches[0].expirationDate?.toDateString()).toBe(testDate.toDateString());
    });

    it('should handle batches without dates', async () => {
      const itemId = await TestItemService.addTestItem({
        name: 'No Date Item',
        batches: [
          {
            quantity: 5,
            // No expiration or purchase date
          },
        ],
      });

      const retrievedItem = await TestItemService.getItemById(itemId);
      
      expect(retrievedItem?.batches[0].quantity).toBe(5);
      expect(retrievedItem?.batches[0].expirationDate).toBeUndefined();
      expect(retrievedItem?.batches[0].purchaseDate).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty database', async () => {
      const allItems = await TestItemService.getAllItems();
      expect(allItems).toEqual([]);
    });

    it('should handle large category arrays', async () => {
      const largeCategoryArray = Array.from({ length: 20 }, (_, i) => `category-${i}`);
      
      const itemId = await TestItemService.addTestItem({
        name: 'Many Categories Item',
        categoryIds: largeCategoryArray,
      });

      const retrievedItem = await TestItemService.getItemById(itemId);
      
      expect(retrievedItem?.categoryIds).toHaveLength(20);
      expect(retrievedItem?.categoryIds).toEqual(largeCategoryArray);
    });
  });
});
