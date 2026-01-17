"use client";

import { useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskDto,
  UpdateTaskDto,
} from "@/types";
import { Project } from "@/lib/projects";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void;
  task?: Task | null;
  loading?: boolean;
  projects?: Project[];
}

export default function TaskDialog({
  open,
  onClose,
  onSubmit,
  task,
  loading = false,
  projects = [],
}: TaskDialogProps) {
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    status: yup
      .mixed<TaskStatus>()
      .oneOf(Object.values(TaskStatus))
      .required("Status is required"),
    priority: yup
      .mixed<TaskPriority>()
      .oneOf(Object.values(TaskPriority))
      .required("Priority is required"),
    projectId: yup.string().optional(),
    dueDate: yup
      .string()
      .optional()
      .test("not-in-past", "Due date cannot be in the past", (value) => {
        if (!value) return true;
        return value >= todayStr;
      }),
  });

  const formik = useFormik({
    initialValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? TaskStatus.TODO,
      priority: task?.priority ?? TaskPriority.MEDIUM,
      dueDate: task?.dueDate ?? "",
      projectId: task?.projectId ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        onSubmit({
          ...values,
          projectId: values.projectId || undefined,
          dueDate: values.dueDate || undefined,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            required
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.title && formik.errors.title)}
            helperText={
              formik.touched.title && formik.errors.title
                ? formik.errors.title
                : " "
            }
          />

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={3}
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
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formik.values.status}
              label="Status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.status && formik.errors.status)}
            >
              <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
              <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formik.values.priority}
              label="Priority"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.priority && formik.errors.priority)}
            >
              <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Project</InputLabel>
            <Select
              name="projectId"
              value={formik.values.projectId}
              label="Project"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="">
                <em>No Project</em>
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: todayStr,
            }}
            name="dueDate"
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.dueDate && formik.errors.dueDate)}
            helperText={
              formik.touched.dueDate && formik.errors.dueDate
                ? formik.errors.dueDate
                : " "
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading || formik.isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={loading || formik.isSubmitting || !formik.isValid}
        >
          {loading || formik.isSubmitting
            ? "Saving..."
            : task
            ? "Update"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
