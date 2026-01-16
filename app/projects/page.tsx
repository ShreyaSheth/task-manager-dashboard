"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProject,
} from "@/store/slices/projectSlice";
import { CreateProjectDto, Project } from "@/lib/projects";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProjectDialog from "@/components/ProjectDialog";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { projects, loading, error } = useAppSelector(
    (state) => state.projects
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (user) {
      dispatch(fetchProjects());
    }
  }, [user, dispatch]);

  const handleCreate = async (data: CreateProjectDto) => {
    try {
      await dispatch(createProject(data)).unwrap();
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Project created successfully!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err || "Failed to create project",
        severity: "error",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setDialogOpen(true);
  };

  const handleUpdate = async (data: CreateProjectDto) => {
    if (!editProject) return;
    try {
      await dispatch(updateProject({ id: editProject.id, data })).unwrap();
      setDialogOpen(false);
      setEditProject(null);
      setSnackbar({
        open: true,
        message: "Project updated successfully!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err || "Failed to update project",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await dispatch(deleteProject(projectToDelete.id)).unwrap();
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      setSnackbar({
        open: true,
        message: "Project deleted successfully!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err || "Failed to delete project",
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditProject(null);
  };

  if (authLoading) {
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
    router.push("/login");
    return null;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* AppBar */}
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
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Button color="inherit" sx={{ ml: 2 }}>
                Dashboard
              </Button>
            </Link>
            <Link href="/projects" style={{ textDecoration: "none" }}>
              <Button
                color="inherit"
                sx={{
                  ml: 1,
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                }}
              >
                Projects
              </Button>
            </Link>
            <Link href="/tasks" style={{ textDecoration: "none" }}>
              <Button color="inherit" sx={{ ml: 1 }}>
                Tasks
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/dashboard">
              <IconButton
                sx={{
                  bgcolor: "white",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                My Projects
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and organize your projects
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              py: 1.5,
              px: 3,
            }}
          >
            New Project
          </Button>
        </Box>

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <FolderIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No projects yet
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Create your first project to start organizing your tasks
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Create First Project
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {projects.map((project) => (
              <Card
                key={project.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#f0f4ff",
                        borderRadius: 2,
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FolderIcon sx={{ fontSize: 32, color: "#667eea" }} />
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                    {project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 40,
                    }}
                  >
                    {project.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2, display: "block" }}
                  >
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(project)}
                    sx={{ color: "#667eea" }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(project)}
                    sx={{ color: "#f5576c" }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Create/Edit Project Dialog */}
      <ProjectDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={editProject ? handleUpdate : handleCreate}
        project={editProject}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{projectToDelete?.name}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
