"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/store/slices/taskSlice";
import { fetchProjects } from "@/store/slices/projectSlice";
import { logout } from "@/store/slices/authSlice";
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import TaskDialog from "@/components/TaskDialog";
import { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from "@/types";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { tasks, loading: tasksLoading } = useAppSelector(
    (state) => state.tasks
  );
  const { projects } = useAppSelector((state) => state.projects);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [projectFilter, setProjectFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
      dispatch(fetchProjects());
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data: CreateTaskDto | UpdateTaskDto) => {
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask.id, data })).unwrap();
        dispatch(fetchTasks());
      } else {
        await dispatch(createTask(data as CreateTaskDto)).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      // This typically happens if the dev server restarted and in-memory tasks were reset,
      // or if the task was deleted elsewhere. Refresh and close the dialog.
      const msg = typeof error === "string" ? error : (error as any)?.message;
      if (String(msg).toLowerCase().includes("task not found")) {
        dispatch(fetchTasks());
        handleCloseDialog();
        return;
      }
      console.error("Task operation error:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (error) {
        const msg = typeof error === "string" ? error : (error as any)?.message;
        if (String(msg).toLowerCase().includes("task not found")) {
          dispatch(fetchTasks());
          return;
        }
        console.error("Delete task error:", error);
      }
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await dispatch(updateTask({ id: taskId, data: { status } })).unwrap();
      // Keep UI counts + chips perfectly in sync with server truth
      dispatch(fetchTasks());
    } catch (error) {
      console.error("Update task status error:", error);
    }
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    let matchesStatus = true;
    if (tabValue === 1) matchesStatus = task.status === TaskStatus.TODO;
    else if (tabValue === 2)
      matchesStatus = task.status === TaskStatus.IN_PROGRESS;
    else if (tabValue === 3)
      matchesStatus = task.status === TaskStatus.COMPLETED;

    // Filter by project
    let matchesProject = true;
    if (projectFilter === "none") {
      matchesProject = !task.projectId;
    } else if (projectFilter !== "all") {
      matchesProject = task.projectId === projectFilter;
    }

    return matchesStatus && matchesProject;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 2 }}
          >
            <DashboardIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              Task Manager
            </Typography>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Button color="inherit" sx={{ ml: 2 }}>
                Dashboard
              </Button>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1.5,
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#667eea",
                  fontWeight: 700,
                  width: 36,
                  height: 36,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={700} color="text.primary">
            My Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6b3f8e 100%)",
              },
            }}
          >
            Add Task
          </Button>
        </Box>

        {/* Project Filter */}
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Project</InputLabel>
            <Select
              value={projectFilter}
              label="Filter by Project"
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <MenuItem value="all">All Projects</MenuItem>
              <MenuItem value="none">No Project</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All (${tasks.length})`} />
            <Tab
              label={`To Do (${
                tasks.filter((t) => t.status === TaskStatus.TODO).length
              })`}
            />
            <Tab
              label={`In Progress (${
                tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length
              })`}
            />
            <Tab
              label={`Completed (${
                tasks.filter((t) => t.status === TaskStatus.COMPLETED).length
              })`}
            />
          </Tabs>
        </Box>

        <TaskList
          tasks={filteredTasks}
          loading={tasksLoading}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          projects={projects}
        />
      </Container>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenDialog()}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5568d3 0%, #6b3f8e 100%)",
          },
        }}
      >
        <AddIcon />
      </Fab>

      <TaskDialog
        key={editingTask ? `edit-${editingTask.id}` : "create-new"}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        task={editingTask}
        loading={tasksLoading}
        projects={projects}
      />
    </Box>
  );
}
