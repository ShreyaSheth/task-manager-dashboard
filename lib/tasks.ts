import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '@/types';
import { storage } from './storage';

const TASKS_KEY = 'tasks';

export const taskStorage = {
  getAll: (): Task[] => {
    return storage.get<Task[]>(TASKS_KEY) || [];
  },

  getById: (id: string): Task | undefined => {
    const tasks = taskStorage.getAll();
    return tasks.find((task) => task.id === id);
  },

  getByUserId: (userId: string): Task[] => {
    const tasks = taskStorage.getAll();
    return tasks.filter((task) => task.userId === userId);
  },

  create: (data: CreateTaskDto, userId: string): Task => {
    const tasks = taskStorage.getAll();
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      status: data.status || TaskStatus.TODO,
      priority: data.priority || TaskPriority.MEDIUM,
      projectId: data.projectId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: data.dueDate,
    };
    tasks.push(newTask);
    storage.set(TASKS_KEY, tasks);
    return newTask;
  },

  update: (id: string, data: UpdateTaskDto, userId: string): Task | null => {
    const tasks = taskStorage.getAll();
    const index = tasks.findIndex((task) => task.id === id && task.userId === userId);
    
    if (index === -1) return null;

    const updatedTask: Task = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    storage.set(TASKS_KEY, tasks);
    return updatedTask;
  },

  delete: (id: string, userId: string): boolean => {
    const tasks = taskStorage.getAll();
    const filteredTasks = tasks.filter((task) => !(task.id === id && task.userId === userId));
    
    if (filteredTasks.length === tasks.length) return false;

    storage.set(TASKS_KEY, filteredTasks);
    return true;
  },

  getStats: (userId: string) => {
    const tasks = taskStorage.getByUserId(userId);
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    };
  },
};

