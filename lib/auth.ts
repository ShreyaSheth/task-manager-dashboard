import bcrypt from "bcryptjs";
import { jwtUtils } from "./jwt";
import { userStorage } from "./users";

const SALT_ROUNDS = 10;

export const authService = {
  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  signup: async (email: string, password: string, name: string) => {
    const existingUser = userStorage.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await authService.hashPassword(password);

    const user = userStorage.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = await jwtUtils.sign({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },

  login: async (email: string, password: string) => {
    const user = userStorage.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await authService.comparePassword(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = await jwtUtils.sign({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },

  verifyToken: async (token: string) => {
    const payload = await jwtUtils.verify(token);
    if (!payload) {
      return null;
    }

    const user = userStorage.findById(payload.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
};
