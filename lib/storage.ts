// Storage utility that works in BOTH environments:
// - Browser: uses localStorage (visible in DevTools)
// - Server/API routes: uses a local JSON file on disk (no DB / no AWS)
//
// Why file-backed on server?
// In Next.js dev (Turbopack), route handlers can run in different workers.
// Pure in-memory storage (globalThis) can become inconsistent across requests
// (create in one worker, update/delete in another => "Task not found").
// A file-backed store makes all requests share the same source of truth.

const isClientSide = (): boolean => typeof window !== "undefined";

type FileStore = Record<string, string>;

const resolveStorePath = (): string => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");

  if ((globalThis as any).__taskManagerStorePath) {
    return (globalThis as any).__taskManagerStorePath;
  }

  let currentDir = process.cwd();
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(currentDir, ".task-manager-store.json");
    if (fs.existsSync(candidate)) {
      (globalThis as any).__taskManagerStorePath = candidate;
      return candidate;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  const fallback = path.join(process.cwd(), ".task-manager-store.json");
  (globalThis as any).__taskManagerStorePath = fallback;
  return fallback;
};

const readServerStore = (): FileStore => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");
  const storePath = resolveStorePath();
  try {
    if (!fs.existsSync(storePath)) return {};
    const raw = fs.readFileSync(storePath, "utf8");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FileStore) : {};
  } catch {
    return {};
  }
};

const writeServerStore = (store: FileStore): void => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");
  const storePath = resolveStorePath();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
};

const getRawItem = (key: string): string | null => {
  if (isClientSide()) {
    return localStorage.getItem(key);
  }
  const store = readServerStore();
  return store[key] ?? null;
};

const setRawItem = (key: string, value: string): void => {
  if (isClientSide()) {
    localStorage.setItem(key, value);
    return;
  }
  const store = readServerStore();
  store[key] = value;
  writeServerStore(store);
};

const removeRawItem = (key: string): void => {
  if (isClientSide()) {
    localStorage.removeItem(key);
    return;
  }
  const store = readServerStore();
  delete store[key];
  writeServerStore(store);
};

const clearRawItems = (): void => {
  if (isClientSide()) {
    localStorage.clear();
    return;
  }
  writeServerStore({});
};

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = getRawItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      setRawItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      removeRawItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  clear: (): void => {
    try {
      clearRawItems();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
