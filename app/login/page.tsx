"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError } from "@/store/slices/authSlice";
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
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

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
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await dispatch(login(values)).unwrap();
        if (result) router.push("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8 rounded-xl">
          <Box className="flex flex-col items-center mb-6">
            <div className="bg-indigo-600 p-3 rounded-full mb-4">
              <LockOutlinedIcon className="text-white text-3xl" />
            </div>
            <Typography
              variant="h4"
              component="h1"
              className="font-bold text-gray-800"
            >
              Sign In
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-2">
              Welcome back! Please sign in to continue
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
              autoFocus
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : " "
              }
              required
              variant="outlined"
              autoComplete="current-password"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={formik.isSubmitting || authLoading}
              className="bg-indigo-600 hover:bg-indigo-700 py-3"
              sx={{ mt: 2 }}
            >
              {formik.isSubmitting || authLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Box className="text-center mt-4">
              <Typography variant="body2" className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
