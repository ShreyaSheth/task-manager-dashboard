import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Project, CreateProjectDto } from "@/lib/projects";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/projects");
      return response.data.projects;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/projects/${id}`);
      return response.data.project;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: CreateProjectDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/projects", projectData);
      return response.data.project;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (
    { id, data }: { id: string; data: Partial<CreateProjectDto> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/projects/${id}`, data);
      return response.data.project;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete project"
      );
    }
  }
);

// Project slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearProjects: (state) => {
      state.projects = [];
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Project By Id
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          state.currentProject = action.payload;
        }
      )
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          state.projects.push(action.payload);
        }
      )
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          const index = state.projects.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
          if (state.currentProject?.id === action.payload.id) {
            state.currentProject = action.payload;
          }
        }
      )
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.projects = state.projects.filter(
            (p) => p.id !== action.payload
          );
          if (state.currentProject?.id === action.payload) {
            state.currentProject = null;
          }
        }
      )
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProject, clearProjects } =
  projectSlice.actions;
export default projectSlice.reducer;
