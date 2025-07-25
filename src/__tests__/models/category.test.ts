import { Category } from '../../models/category';

describe('Category Model', () => {
  describe('Category interface', () => {
    it('should create a valid Category object with all fields', () => {
      const category: Category = {
        id: 'bathroom-1',
        name: 'Bathroom',
        icon: '🚿',
      };

      expect(category.id).toBe('bathroom-1');
      expect(category.name).toBe('Bathroom');
      expect(category.icon).toBe('🚿');
    });

    it('should create a Category with optional icon undefined', () => {
      const category: Category = {
        id: 'kitchen-1',
        name: 'Kitchen',
      };

      expect(category.id).toBe('kitchen-1');
      expect(category.name).toBe('Kitchen');
      expect(category.icon).toBeUndefined();
    });

    it('should handle empty icon string', () => {
      const category: Category = {
        id: 'cleaning-1',
        name: 'Cleaning',
        icon: '',
      };

      expect(category.icon).toBe('');
    });

    it('should handle various icon types', () => {
      const categories: Category[] = [
        {
          id: 'emoji-cat',
          name: 'Emoji Category',
          icon: '🧽',
        },
        {
          id: 'text-cat',
          name: 'Text Category',
          icon: 'CLEAN',
        },
        {
          id: 'symbol-cat',
          name: 'Symbol Category',
          icon: '•',
        },
      ];

      expect(categories[0].icon).toBe('🧽');
      expect(categories[1].icon).toBe('CLEAN');
      expect(categories[2].icon).toBe('•');
    });
  });

  describe('Category name validation scenarios', () => {
    it('should handle various name lengths', () => {
      const shortCategory: Category = {
        id: 'a',
        name: 'A',
      };

      const longCategory: Category = {
        id: 'very-long-id',
        name: 'This is a very long category name that might be used in some scenarios',
      };

      expect(shortCategory.name).toBe('A');
      expect(longCategory.name.length).toBeGreaterThan(50);
    });

    it('should handle special characters in names', () => {
      const specialCategory: Category = {
        id: 'special-1',
        name: 'Kitchen & Dining',
        icon: '🍽️',
      };

      expect(specialCategory.name).toBe('Kitchen & Dining');
    });

    it('should handle names with numbers', () => {
      const numberedCategory: Category = {
        id: 'floor-2',
        name: '2nd Floor Items',
        icon: '2️⃣',
      };

      expect(numberedCategory.name).toBe('2nd Floor Items');
    });
  });

  describe('Category collections', () => {
    it('should handle array of categories', () => {
      const categories: Category[] = [
        { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
        { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
        { id: 'cleaning', name: 'Cleaning', icon: '🧽' },
        { id: 'personal', name: 'Personal Care' }, // No icon
      ];

      expect(categories).toHaveLength(4);
      expect(categories[3].icon).toBeUndefined();
      
      // Test that all have required fields
      categories.forEach(category => {
        expect(category.id).toBeDefined();
        expect(category.name).toBeDefined();
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
      });
    });

    it('should handle empty categories array', () => {
      const categories: Category[] = [];

      expect(categories).toHaveLength(0);
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe('Category ID scenarios', () => {
    it('should handle various ID formats', () => {
      const categories: Category[] = [
        { id: 'simple', name: 'Simple ID' },
        { id: 'kebab-case-id', name: 'Kebab Case' },
        { id: 'snake_case_id', name: 'Snake Case' },
        { id: 'uuid-like-12345', name: 'UUID-like' },
        { id: '123', name: 'Numeric ID' },
      ];

      categories.forEach(category => {
        expect(typeof category.id).toBe('string');
        expect(category.id.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Real-world category examples', () => {
    it('should handle typical vacation house categories', () => {
      const vacationHouseCategories: Category[] = [
        { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
        { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
        { id: 'cleaning', name: 'Cleaning Supplies', icon: '🧽' },
        { id: 'personal-care', name: 'Personal Care', icon: '🧴' },
        { id: 'laundry', name: 'Laundry', icon: '👕' },
        { id: 'paper-products', name: 'Paper Products', icon: '🧻' },
        { id: 'food-pantry', name: 'Food & Pantry', icon: '🥫' },
        { id: 'outdoor', name: 'Outdoor', icon: '🏡' },
      ];

      expect(vacationHouseCategories).toHaveLength(8);
      
      // Check that all categories have meaningful names
      vacationHouseCategories.forEach(category => {
        expect(category.name.length).toBeGreaterThan(3);
        expect(category.icon).toBeDefined();
      });

      // Check specific categories exist
      const kitchenCategory = vacationHouseCategories.find(c => c.id === 'kitchen');
      expect(kitchenCategory).toBeDefined();
      expect(kitchenCategory?.name).toBe('Kitchen');
    });
  });
});
