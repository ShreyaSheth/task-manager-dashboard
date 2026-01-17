export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

import { storage } from "./storage";

const USERS_KEY = "users";

const getAllUsers = (): User[] => {
  return storage.get<User[]>(USERS_KEY) || [];
};

const setAllUsers = (users: User[]): void => {
  storage.set(USERS_KEY, users);
};

export const userStorage = {
  create: (user: Omit<User, "id" | "createdAt">): User => {
    const users = getAllUsers();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setAllUsers(users);
    return newUser;
  },

  findByEmail: (email: string): User | undefined => {
    const users = getAllUsers();
    return users.find((user) => user.email === email);
  },

  findById: (id: string): User | undefined => {
    const users = getAllUsers();
    return users.find((user) => user.id === id);
  },

  getAll: (): User[] => {
    return getAllUsers();
  },

  delete: (id: string): boolean => {
    const users = getAllUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    setAllUsers(filtered);
    return true;
  },
};
