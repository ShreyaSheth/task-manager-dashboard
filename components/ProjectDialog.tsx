"use client";

import { useFormik } from "formik";
import * as yup from "yup";
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
  const validationSchema = yup.object({
    name: yup
      .string()
      .min(2, "Project name is too short")
      .required("Project name is required"),
    description: yup
      .string()
      .min(5, "Description is too short")
      .required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
  });

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
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.name && formik.errors.name)}
            helperText={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : " "
            }
            placeholder="Enter project name"
          />

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : " "
            }
            placeholder="Describe your project"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={loading || formik.isSubmitting || !formik.isValid}
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
