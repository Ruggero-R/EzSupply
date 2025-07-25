import { User } from '../models';
import { db } from '../config/firebase';
import { collection, getDocs, getDoc, doc, addDoc, setDoc, DocumentData, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class UserService {
    private static readonly COLLECTION = 'users';
    private static readonly CURRENT_USER_KEY = 'currentUser';
    private static userCache: User[] | null = null;

    /**
     * Get all users from Firestore.
     * @returns Promise<User[]> - Array of all users.
     */
    static async getAllUsers(): Promise<User[]> {
        // Return cached users if available
        if (this.userCache) {
            return this.userCache;
        }

        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
                collection(db, this.COLLECTION)
            );

            const users: User[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                users.push({
                    id: doc.id,
                    username: data.username,
                });
            });

            // Cache the users
            this.userCache = users;
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }

    /**
     * Get a single user by ID.
     * @param id - The user document ID.
     * @returns Promise<User | null> - The user or null if not found.
     */
    static async getUserById(id: string): Promise<User | null> {
        try {
            const docSnap: DocumentSnapshot<DocumentData> = await getDoc(
                doc(db, this.COLLECTION, id)
            );

            if (!docSnap.exists()) {
                return null;
            }

            const data = docSnap.data();
            return {
                id: docSnap.id,
                username: data.username,
            };
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new Error('Failed to fetch user');
        }
    }

    /**
     * Get a user by username.
     * @param username - The username to search for.
     * @returns Promise<User | null> - The user or null if not found.
     */
    static async getUserByUsername(username: string): Promise<User | null> {
        try {
            const users = await this.getAllUsers();
            return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
        } catch (error) {
            console.error('Error fetching user by username:', error);
            throw new Error('Failed to fetch user');
        }
    }

    /**
     * Create a new user.
     * @param username - The username for the new user.
     * @returns Promise<string> - The new user's document ID.
     */
    static async createUser(username: string): Promise<string> {
        try {
            // Check if username already exists
            const existingUser = await this.getUserByUsername(username);
            if (existingUser) {
                throw new Error('Username already exists');
            }

            const userData = {
                username: username.trim(),
                createdAt: new Date(),
            };

            const docRef = await addDoc(collection(db, this.COLLECTION), userData);
            
            // Clear cache to force refresh
            this.userCache = null;
            
            return docRef.id;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    /**
     * Update a user's information.
     * @param id - The user document ID.
     * @param updates - Partial user data to update.
     * @returns Promise<void>
     */
    static async updateUser(id: string, updates: Partial<Omit<User, 'id'>>): Promise<void> {
        try {
            const userDoc = doc(db, this.COLLECTION, id);
            await setDoc(userDoc, {
                ...updates,
                updatedAt: new Date(),
            }, { merge: true });

            // Clear cache to force refresh
            this.userCache = null;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }

    /**
     * Set the current active user (stored locally).
     * @param user - The user to set as current.
     */
    static async setCurrentUser(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error setting current user:', error);
            throw new Error('Failed to set current user');
        }
    }

    /**
     * Get the current active user from local storage.
     * @returns Promise<User | null> - The current user or null.
     */
    static async getCurrentUser(): Promise<User | null> {
        try {
            const userJson = await AsyncStorage.getItem(this.CURRENT_USER_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    /**
     * Clear the current user (logout equivalent).
     */
    static async clearCurrentUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.CURRENT_USER_KEY);
        } catch (error) {
            console.error('Error clearing current user:', error);
        }
    }

    /**
     * Initialize default users (run this once to set up your brothers).
     * @param usernames - Array of usernames to create.
     */
    static async initializeDefaultUsers(usernames: string[]): Promise<void> {
        try {
            const existingUsers = await this.getAllUsers();
            
            for (const username of usernames) {
                const exists = existingUsers.some(user => 
                    user.username.toLowerCase() === username.toLowerCase()
                );
                
                if (!exists) {
                    await this.createUser(username);
                    console.log(`Created user: ${username}`);
                }
            }
        } catch (error) {
            console.error('Error initializing default users:', error);
            throw new Error('Failed to initialize default users');
        }
    }

    /**
     * Clear the user cache (force refresh from Firestore).
     */
    static clearCache(): void {
        this.userCache = null;
    }
}