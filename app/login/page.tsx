"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError } from "@/store/slices/authSlice";
import Link from "next/link";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      // On success, redirect to dashboard
      if (result) {
        router.push("/dashboard");
      }
    } catch (err) {
      // Error is handled by Redux
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

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

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              autoComplete="email"
              autoFocus
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting || authLoading}
              className="bg-indigo-600 hover:bg-indigo-700 py-3"
              sx={{ mt: 2 }}
            >
              {submitting || authLoading ? (
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
