"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Project, CreateProjectDto } from "@/lib/projects";

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectDto) => void;
  project?: Project | null;
  loading?: boolean;
}

export default function ProjectDialog({
  open,
  onClose,
  onSubmit,
  project,
  loading = false,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [project, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {project ? "Edit Project" : "Create New Project"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Project Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter project name"
          />

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe your project"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.description}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {loading ? "Saving..." : project ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
