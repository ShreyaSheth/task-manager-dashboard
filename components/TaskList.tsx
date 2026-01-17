"use client";

import { Task, TaskStatus } from "@/types";
import { Project } from "@/lib/projects";
import { Box, Typography, CircularProgress } from "@mui/material";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  projects?: Project[];
}

export default function TaskList({
  tasks,
  loading = false,
  onEdit,
  onDelete,
  onStatusChange,
  projects = [],
}: TaskListProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No tasks yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Click "Add Task" to create your first task
        </Typography>
      </Box>
    );
  }

  // Helper to get project name by ID
  const getProjectName = (projectId?: string): string | undefined => {
    if (!projectId) return undefined;
    const project = projects.find((p) => p.id === projectId);
    return project?.name;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          projectName={getProjectName(task.projectId)}
        />
      ))}
    </Box>
  );
}
