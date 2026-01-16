export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

let users: Map<string, User> = new Map();

export const userStorage = {
  create: (user: Omit<User, "id" | "createdAt">): User => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.set(newUser.id, newUser);
    return newUser;
  },

  findByEmail: (email: string): User | undefined => {
    return Array.from(users.values()).find((user) => user.email === email);
  },

  findById: (id: string): User | undefined => {
    return users.get(id);
  },

  getAll: (): User[] => {
    return Array.from(users.values());
  },

  delete: (id: string): boolean => {
    return users.delete(id);
  },
};
