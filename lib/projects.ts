import { storage } from "./storage";

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
}

const PROJECTS_KEY = "projects";

export const projectStorage = {
  getAll: (): Project[] => {
    return storage.get<Project[]>(PROJECTS_KEY) || [];
  },

  getById: (id: string): Project | undefined => {
    const projects = projectStorage.getAll();
    return projects.find((project) => project.id === id);
  },

  getByUserId: (userId: string): Project[] => {
    const projects = projectStorage.getAll();
    return projects.filter((project) => project.userId === userId);
  },

  create: (data: CreateProjectDto, userId: string): Project => {
    const projects = projectStorage.getAll();
    const newProject: Project = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    storage.set(PROJECTS_KEY, projects);
    return newProject;
  },

  update: (
    id: string,
    data: Partial<CreateProjectDto>,
    userId: string
  ): Project | null => {
    const projects = projectStorage.getAll();
    const index = projects.findIndex((p) => p.id === id && p.userId === userId);

    if (index === -1) return null;

    const updatedProject: Project = {
      ...projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    storage.set(PROJECTS_KEY, projects);
    return updatedProject;
  },

  delete: (id: string, userId: string): boolean => {
    const projects = projectStorage.getAll();
    const filtered = projects.filter(
      (p) => !(p.id === id && p.userId === userId)
    );

    if (filtered.length === projects.length) return false;

    storage.set(PROJECTS_KEY, filtered);
    return true;
  },

  getStats: (userId: string) => {
    const projects = projectStorage.getByUserId(userId);
    return {
      total: projects.length,
    };
  },
};
