import { User } from '../../models/user';

describe('User Model', () => {
  describe('User interface', () => {
    it('should create a valid User object', () => {
      const user: User = {
        id: 'user-123',
        username: 'Ruggero',
      };

      expect(user.id).toBe('user-123');
      expect(user.username).toBe('Ruggero');
      expect(typeof user.id).toBe('string');
      expect(typeof user.username).toBe('string');
    });

    it('should handle various username formats', () => {
      const users: User[] = [
        { id: '1', username: 'Ruggero' },
        { id: '2', username: 'Brother1' },
        { id: '3', username: 'brother_two' },
        { id: '4', username: 'Brother-Three' },
        { id: '5', username: 'b4' }, // Short username
      ];

      users.forEach(user => {
        expect(user.id).toBeDefined();
        expect(user.username).toBeDefined();
        expect(typeof user.id).toBe('string');
        expect(typeof user.username).toBe('string');
        expect(user.username.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Username scenarios', () => {
    it('should handle single character usernames', () => {
      const user: User = {
        id: 'short-id',
        username: 'R',
      };

      expect(user.username).toBe('R');
      expect(user.username.length).toBe(1);
    });

    it('should handle long usernames', () => {
      const user: User = {
        id: 'long-id',
        username: 'VeryLongUsernameForTesting',
      };

      expect(user.username).toBe('VeryLongUsernameForTesting');
      expect(user.username.length).toBeGreaterThan(20);
    });

    it('should handle usernames with numbers', () => {
      const user: User = {
        id: 'numeric-id',
        username: 'User123',
      };

      expect(user.username).toBe('User123');
      expect(user.username).toMatch(/\d/); // Contains at least one digit
    });

    it('should handle usernames with special characters', () => {
      const users: User[] = [
        { id: '1', username: 'user_name' },
        { id: '2', username: 'user-name' },
        { id: '3', username: 'user.name' },
      ];

      expect(users[0].username).toBe('user_name');
      expect(users[1].username).toBe('user-name');
      expect(users[2].username).toBe('user.name');
    });
  });

  describe('User ID scenarios', () => {
    it('should handle various ID formats', () => {
      const users: User[] = [
        { id: 'uuid-abc123', username: 'User1' },
        { id: '12345', username: 'User2' },
        { id: 'firestore-doc-id', username: 'User3' },
        { id: 'a', username: 'User4' }, // Very short ID
      ];

      users.forEach(user => {
        expect(typeof user.id).toBe('string');
        expect(user.id.length).toBeGreaterThan(0);
      });
    });
  });

  describe('User collections', () => {
    it('should handle array of users (family members)', () => {
      const familyMembers: User[] = [
        { id: 'ruggero-id', username: 'Ruggero' },
        { id: 'brother1-id', username: 'Marco' },
        { id: 'brother2-id', username: 'Luca' },
      ];

      expect(familyMembers).toHaveLength(3);
      
      // Check all users have unique IDs
      const ids = familyMembers.map(user => user.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(familyMembers.length);

      // Check all users have unique usernames
      const usernames = familyMembers.map(user => user.username);
      const uniqueUsernames = new Set(usernames);
      expect(uniqueUsernames.size).toBe(familyMembers.length);
    });

    it('should handle empty users array', () => {
      const users: User[] = [];

      expect(users).toHaveLength(0);
      expect(Array.isArray(users)).toBe(true);
    });

    it('should find user by username in array', () => {
      const users: User[] = [
        { id: '1', username: 'Ruggero' },
        { id: '2', username: 'Marco' },
        { id: '3', username: 'Luca' },
      ];

      const foundUser = users.find(user => user.username === 'Marco');
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe('2');
      expect(foundUser?.username).toBe('Marco');

      const notFoundUser = users.find(user => user.username === 'NonExistent');
      expect(notFoundUser).toBeUndefined();
    });

    it('should find user by ID in array', () => {
      const users: User[] = [
        { id: 'ruggero-123', username: 'Ruggero' },
        { id: 'marco-456', username: 'Marco' },
        { id: 'luca-789', username: 'Luca' },
      ];

      const foundUser = users.find(user => user.id === 'marco-456');
      expect(foundUser).toBeDefined();
      expect(foundUser?.username).toBe('Marco');

      const notFoundUser = users.find(user => user.id === 'non-existent');
      expect(notFoundUser).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle whitespace in usernames', () => {
      const users: User[] = [
        { id: '1', username: ' Ruggero ' }, // Leading/trailing spaces
        { id: '2', username: 'Marco Antonio' }, // Space in middle
      ];

      expect(users[0].username).toBe(' Ruggero ');
      expect(users[1].username).toBe('Marco Antonio');
      
      // Note: In real app, you might want to trim whitespace
    });

    it('should document case sensitivity', () => {
      const users: User[] = [
        { id: '1', username: 'ruggero' },
        { id: '2', username: 'Ruggero' },
        { id: '3', username: 'RUGGERO' },
      ];

      // These are all different users (case sensitive)
      const usernames = users.map(u => u.username);
      const uniqueUsernames = new Set(usernames);
      expect(uniqueUsernames.size).toBe(3);
    });
  });
});
