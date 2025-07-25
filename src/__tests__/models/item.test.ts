import { Item, ItemBatch } from '../../models/item';

describe('Item Model', () => {
  describe('Item interface', () => {
    it('should create a valid Item object', () => {
      const item: Item = {
        id: 'test-id',
        name: 'Toilet Paper',
        unit: 'rolls',
        minThreshold: 2,
        categoryIds: ['bathroom', 'essentials'],
        batches: [],
        location: 'upstairs bathroom',
        notes: 'Buy Charmin Ultra Soft',
        lastUpdate: new Date(),
        updatedBy: 'Ruggero',
      };

      expect(item.id).toBe('test-id');
      expect(item.name).toBe('Toilet Paper');
      expect(item.unit).toBe('rolls');
      expect(item.minThreshold).toBe(2);
      expect(item.categoryIds).toEqual(['bathroom', 'essentials']);
      expect(Array.isArray(item.batches)).toBe(true);
      expect(item.location).toBe('upstairs bathroom');
      expect(item.notes).toBe('Buy Charmin Ultra Soft');
      expect(item.lastUpdate).toBeInstanceOf(Date);
      expect(item.updatedBy).toBe('Ruggero');
    });

    it('should create an Item with optional fields undefined', () => {
      const item: Item = {
        id: 'test-id',
        name: 'Dish Soap',
        unit: 'bottles',
        minThreshold: 1,
        categoryIds: ['kitchen'],
        batches: [],
        lastUpdate: new Date(),
        updatedBy: 'Brother1',
      };

      expect(item.location).toBeUndefined();
      expect(item.notes).toBeUndefined();
    });

    it('should handle empty categoryIds array', () => {
      const item: Item = {
        id: 'test-id',
        name: 'Generic Item',
        unit: 'pieces',
        minThreshold: 1,
        categoryIds: [],
        batches: [],
        lastUpdate: new Date(),
        updatedBy: 'Ruggero',
      };

      expect(item.categoryIds).toEqual([]);
      expect(item.categoryIds.length).toBe(0);
    });
  });

  describe('ItemBatch interface', () => {
    it('should create a valid ItemBatch with all fields', () => {
      const batch: ItemBatch = {
        quantity: 5,
        expirationDate: new Date('2024-12-31'),
        purchaseDate: new Date('2024-01-01'),
      };

      expect(batch.quantity).toBe(5);
      expect(batch.expirationDate).toBeInstanceOf(Date);
      expect(batch.purchaseDate).toBeInstanceOf(Date);
    });

    it('should create a ItemBatch with optional dates undefined', () => {
      const batch: ItemBatch = {
        quantity: 10,
      };

      expect(batch.quantity).toBe(10);
      expect(batch.expirationDate).toBeUndefined();
      expect(batch.purchaseDate).toBeUndefined();
    });

    it('should handle zero quantity', () => {
      const batch: ItemBatch = {
        quantity: 0,
        expirationDate: new Date(),
      };

      expect(batch.quantity).toBe(0);
    });
  });

  describe('Item with ItemBatches integration', () => {
    it('should create an Item with multiple batches', () => {
      const batches: ItemBatch[] = [
        {
          quantity: 3,
          expirationDate: new Date('2024-01-15'),
          purchaseDate: new Date('2024-01-01'),
        },
        {
          quantity: 2,
          expirationDate: new Date('2024-01-20'),
          purchaseDate: new Date('2024-01-10'),
        },
      ];

      const item: Item = {
        id: 'milk-1',
        name: 'Milk',
        unit: 'cartons',
        minThreshold: 1,
        categoryIds: ['kitchen', 'dairy'],
        batches: batches,
        location: 'refrigerator',
        lastUpdate: new Date(),
        updatedBy: 'Ruggero',
      };

      expect(item.batches).toHaveLength(2);
      expect(item.batches[0].quantity).toBe(3);
      expect(item.batches[1].quantity).toBe(2);
    });

    it('should handle an Item with non-expiring batches', () => {
      const batches: ItemBatch[] = [
        {
          quantity: 12,
          // No expiration date for non-perishable items
        },
      ];

      const item: Item = {
        id: 'toilet-paper-1',
        name: 'Toilet Paper',
        unit: 'rolls',
        minThreshold: 3,
        categoryIds: ['bathroom'],
        batches: batches,
        lastUpdate: new Date(),
        updatedBy: 'Brother1',
      };

      expect(item.batches[0].expirationDate).toBeUndefined();
      expect(item.batches[0].quantity).toBe(12);
    });
  });

  describe('Edge cases and validation', () => {
    it('should handle negative quantities (business logic concern)', () => {
      // Note: TypeScript doesn't prevent negative numbers
      // This test documents the current behavior
      const batch: ItemBatch = {
        quantity: -1,
      };

      expect(batch.quantity).toBe(-1);
      // In real app, you'd want validation to prevent this
    });

    it('should handle very large category arrays', () => {
      const largeCategoryArray = Array.from({ length: 100 }, (_, i) => `category-${i}`);
      
      const item: Item = {
        id: 'test-id',
        name: 'Multi-category Item',
        unit: 'pieces',
        minThreshold: 1,
        categoryIds: largeCategoryArray,
        batches: [],
        lastUpdate: new Date(),
        updatedBy: 'Ruggero',
      };

      expect(item.categoryIds).toHaveLength(100);
      expect(item.categoryIds[0]).toBe('category-0');
      expect(item.categoryIds[99]).toBe('category-99');
    });

    it('should handle future and past dates', () => {
      const futureDate = new Date('2030-01-01');
      const pastDate = new Date('2020-01-01');

      const batch: ItemBatch = {
        quantity: 1,
        expirationDate: futureDate,
        purchaseDate: pastDate,
      };

      expect(batch.expirationDate?.getFullYear()).toBe(2030);
      expect(batch.purchaseDate?.getFullYear()).toBe(2020);
    });
  });
});
