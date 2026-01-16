"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { fetchTaskStats } from "@/store/slices/taskSlice";
import { fetchProjects, createProject } from "@/store/slices/projectSlice";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectDialog from "@/components/ProjectDialog";
import { CreateProjectDto } from "@/lib/projects";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import TaskIcon from "@mui/icons-material/Task";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { stats } = useAppSelector((state) => state.tasks);
  const { projects, loading: projectsLoading } = useAppSelector(
    (state) => state.projects
  );
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  useEffect(() => {
    // Set date only on client-side to avoid hydration mismatch
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchTaskStats());
      dispatch(fetchProjects());
    }
  }, [user, dispatch]);

  const handleCreateProject = async (data: CreateProjectDto) => {
    try {
      await dispatch(createProject(data)).unwrap();
      setProjectDialogOpen(false);
    } catch (error) {
      console.error("Create project error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Modern AppBar */}
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
            <Typography variant="h6" component="div" fontWeight={600}>
              Task Manager
            </Typography>
            <Link href="/projects" style={{ textDecoration: "none" }}>
              <Button color="inherit" sx={{ ml: 2 }}>
                Projects
              </Button>
            </Link>
            <Link href="/tasks" style={{ textDecoration: "none" }}>
              <Button color="inherit" sx={{ ml: 1 }}>
                Tasks
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Welcome back, {user.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your projects today
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <Link href="/projects" style={{ textDecoration: "none" }}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FolderIcon sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {projects.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Total Projects
                </Typography>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tasks" style={{ textDecoration: "none" }}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TaskIcon sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {stats ? stats.total - stats.completed : 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Active Tasks
                </Typography>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/tasks?filter=completed"
            style={{ textDecoration: "none" }}
          >
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {stats?.completed || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Link>

          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              borderRadius: 3,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={700}>
                {stats && stats.total > 0
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}
                %
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Completion Rate
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 3,
          }}
        >
          {/* Quick Actions */}
          <Box>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Quick Actions
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                <Box>
                  <Paper
                    elevation={0}
                    onClick={() => setProjectDialogOpen(true)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#f0f4ff",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: "2px dashed #667eea",
                      "&:hover": {
                        bgcolor: "#e8eeff",
                        borderColor: "#764ba2",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <FolderIcon
                        sx={{ color: "#667eea", mr: 1.5, fontSize: 28 }}
                      />
                      <Typography variant="h6" fontWeight={600} color="#667eea">
                        New Project
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Create a new project to organize tasks
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Link href="/tasks" style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "#fff0f6",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: "2px dashed #f5576c",
                        "&:hover": {
                          bgcolor: "#ffe8f0",
                          borderColor: "#f093fb",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <AddIcon
                          sx={{ color: "#f5576c", mr: 1.5, fontSize: 28 }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#f5576c"
                        >
                          Create New Task
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Add a new task to your list
                      </Typography>
                    </Paper>
                  </Link>
                </Box>

                <Box>
                  <Link href="/projects" style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "#f0fff4",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: "2px dashed #38a169",
                        "&:hover": {
                          bgcolor: "#e6ffed",
                          borderColor: "#2f855a",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <FolderIcon
                          sx={{ color: "#38a169", mr: 1.5, fontSize: 28 }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#38a169"
                        >
                          View Projects
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Browse all your projects
                      </Typography>
                    </Paper>
                  </Link>
                </Box>

                <Box>
                  <Link href="/tasks" style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "#fffbf0",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: "2px dashed #d69e2e",
                        "&:hover": {
                          bgcolor: "#fff8e6",
                          borderColor: "#b7791f",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <TaskIcon
                          sx={{ color: "#d69e2e", mr: 1.5, fontSize: 28 }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#d69e2e"
                        >
                          View Tasks
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Manage and track all your tasks
                      </Typography>
                    </Paper>
                  </Link>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Recent Activity
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No recent activity yet. Start by creating your first
                    project!
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Stack spacing={3}>
            {/* User Profile Card */}
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid #e0e0e0", mb: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "#667eea",
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    #{user.id}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Calendar Widget */}
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarTodayIcon sx={{ color: "#667eea", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Today's Overview
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "#f5f7fa",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                }}
              >
                {currentDate ? (
                  <>
                    <Typography variant="h4" fontWeight={700} color="#667eea">
                      {currentDate.getDate()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                  </>
                ) : (
                  <CircularProgress size={24} />
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  No tasks scheduled for today
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Box>
      </Container>

      {/* Project Dialog */}
      <ProjectDialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        onSubmit={handleCreateProject}
        loading={projectsLoading}
      />
    </Box>
  );
}
