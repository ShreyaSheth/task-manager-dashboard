"use client";

import { Task, TaskStatus, TaskPriority } from "@/types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import FolderIcon from "@mui/icons-material/Folder";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  projectName?: string;
}

const statusColors = {
  [TaskStatus.TODO]: "#3b82f6",
  [TaskStatus.IN_PROGRESS]: "#f59e0b",
  [TaskStatus.COMPLETED]: "#10b981",
};

const priorityColors = {
  [TaskPriority.LOW]: "#6b7280",
  [TaskPriority.MEDIUM]: "#f59e0b",
  [TaskPriority.HIGH]: "#ef4444",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  projectName,
}: TaskCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    handleMenuClose();
  };

  const handleStatusToggle = () => {
    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.TODO
        : TaskStatus.COMPLETED;
    onStatusChange(task.id, newStatus);
  };

  return (
    <Card
      elevation={2}
      // Disable "clicking the task card" (no task detail page)
      // If this card ever gets wrapped in a Link, this prevents accidental navigation.
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      sx={{
        borderRadius: 2,
        transition: "all 0.2s",
        cursor: "default",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 1, flex: 1 }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusToggle();
              }}
              sx={{ mt: -0.5 }}
            >
              {task.status === TaskStatus.COMPLETED ? (
                <CheckCircleIcon
                  sx={{ color: statusColors[TaskStatus.COMPLETED] }}
                />
              ) : (
                <RadioButtonUncheckedIcon sx={{ color: "#9ca3af" }} />
              )}
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration:
                    task.status === TaskStatus.COMPLETED
                      ? "line-through"
                      : "none",
                  color:
                    task.status === TaskStatus.COMPLETED
                      ? "#9ca3af"
                      : "inherit",
                  wordBreak: "break-word",
                }}
              >
                {task.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  textDecoration:
                    task.status === TaskStatus.COMPLETED
                      ? "line-through"
                      : "none",
                }}
              >
                {task.description}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={task.status.replace("_", " ").toUpperCase()}
            size="small"
            sx={{
              bgcolor: statusColors[task.status],
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
          <Chip
            label={task.priority.toUpperCase()}
            size="small"
            sx={{
              bgcolor: priorityColors[task.priority],
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
          {projectName && (
            <Chip
              icon={<FolderIcon sx={{ fontSize: "0.9rem !important" }} />}
              label={projectName}
              size="small"
              sx={{
                bgcolor: "#667eea",
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          )}
          {task.dueDate && (
            <Chip
              label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
