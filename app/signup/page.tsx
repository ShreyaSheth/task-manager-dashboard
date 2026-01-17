"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signup, clearError } from "@/store/slices/authSlice";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(2, "Enter your full name")
      .required("Name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await dispatch(
          signup({
            email: values.email,
            password: values.password,
            name: values.name,
          })
        ).unwrap();
        if (result) router.push("/dashboard");
      } catch (err) {
        console.error("Signup error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8 rounded-xl">
          <Box className="flex flex-col items-center mb-6">
            <div className="bg-purple-600 p-3 rounded-full mb-4">
              <PersonAddOutlinedIcon className="text-white text-3xl" />
            </div>
            <Typography
              variant="h4"
              component="h1"
              className="font-bold text-gray-800"
            >
              Sign Up
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-2">
              Create your account to get started
            </Typography>
          </Box>

          {authError && (
            <Alert severity="error" className="mb-4">
              {authError}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
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
              required
              variant="outlined"
              autoComplete="name"
              autoFocus
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.email && formik.errors.email)}
              helperText={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : " "
              }
              required
              variant="outlined"
              autoComplete="email"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : "Must be at least 6 characters"
              }
              required
              variant="outlined"
              autoComplete="new-password"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )}
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? formik.errors.confirmPassword
                  : " "
              }
              required
              variant="outlined"
              autoComplete="new-password"
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={formik.isSubmitting || authLoading}
              className="bg-purple-600 hover:bg-purple-700 py-3"
              sx={{ mt: 2 }}
            >
              {formik.isSubmitting || authLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <Box className="text-center mt-4">
              <Typography variant="body2" className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-600 hover:text-purple-800 font-semibold"
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
