import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Task, CreateTaskDto, UpdateTaskDto } from "@/types";
import { logout } from "@/store/slices/authSlice";

interface TaskState {
  tasks: Task[];
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  stats: {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tasks");
      return response.data.tasks;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch tasks"
      );
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  "tasks/fetchTaskStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tasks/stats");
      return response.data.stats;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch stats"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: CreateTaskDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tasks", taskData);
      return response.data.task;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, data }: { id: string; data: UpdateTaskDto },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, data);
      return response.data.task;
    } catch (error: any) {
      // If the server lost in-memory data (dev hot reload) or task was removed elsewhere,
      // refresh the list so UI doesn't keep showing stale tasks.
      if (error.response?.status === 404) {
        dispatch(fetchTasks());
      }
      return rejectWithValue(
        error.response?.data?.error || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      return id;
    } catch (error: any) {
      if (error.response?.status === 404) {
        dispatch(fetchTasks());
      }
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete task"
      );
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.stats = {
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Task Stats
    builder
      .addCase(fetchTaskStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
        // Update stats
        state.stats.total++;
        if (action.payload.status === "todo") state.stats.todo++;
        else if (action.payload.status === "in_progress")
          state.stats.inProgress++;
        else if (action.payload.status === "completed") state.stats.completed++;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        const prevStatus = index !== -1 ? state.tasks[index].status : null;
        const nextStatus = action.payload.status;

        if (index !== -1) {
          state.tasks[index] = action.payload;
        } else {
          // If state got out of sync, still add the updated task so UI updates
          state.tasks.push(action.payload);
          state.stats.total++;
        }

        if (prevStatus && prevStatus !== nextStatus) {
          if (prevStatus === "todo") state.stats.todo--;
          else if (prevStatus === "in_progress") state.stats.inProgress--;
          else if (prevStatus === "completed") state.stats.completed--;

          if (nextStatus === "todo") state.stats.todo++;
          else if (nextStatus === "in_progress") state.stats.inProgress++;
          else if (nextStatus === "completed") state.stats.completed++;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        const task = state.tasks.find((t) => t.id === action.payload);
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        // Update stats
        if (task) {
          state.stats.total--;
          if (task.status === "todo") state.stats.todo--;
          else if (task.status === "in_progress") state.stats.inProgress--;
          else if (task.status === "completed") state.stats.completed--;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout -> reset task state (avoid editing tasks from previous session/user)
    builder.addCase(logout.fulfilled, () => initialState);
  },
});

export const { clearError, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
