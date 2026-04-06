import { UserRole } from './constants';
import { User, dummyUsers } from '@/data/users';

const STORAGE_KEY = 'mock_auth_users';
const CURRENT_USER_KEY = 'mock_auth_current_user_id';

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  title?: string;
  phone?: string;
}

/**
 * Basic email validation with regex
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Gets all users from local storage, fallback to starting with dummyUsers
 */
const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return dummyUsers;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyUsers));
    return dummyUsers;
  }
  return JSON.parse(stored);
};

/**
 * Save users to local storage
 */
const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

/**
 * ASYNC Mock Signup
 */
export const signup = async (data: SignupData): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!validateEmail(data.email)) {
    throw new Error('Invalid email format');
  }

  const users = getStoredUsers();
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: data.role,
    title: data.title,
    phone: data.phone || '',
    imageUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  // Set as current user
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    localStorage.setItem('currentUserId', newUser.id); // for existing compatibility
  }

  return newUser;
};

/**
 * ASYNC Mock Login
 */
export const login = async (email: string, password?: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    localStorage.setItem('currentUserId', user.id); // for existing compatibility
  }

  return user;
};

/**
 * SYNC Mock Logout
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem('currentUserId');
};

/**
 * SYNC Get current logged in user
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const currentId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentId) return null;

  const users = getStoredUsers();
  return users.find(u => u.id === currentId) || null;
};
