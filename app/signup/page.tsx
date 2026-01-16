"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signup, clearError } from "@/store/slices/authSlice";
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
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
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
    setLocalError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    try {
      const result = await dispatch(signup({ email, password, name })).unwrap();
      // On success, redirect to dashboard
      if (result) {
        router.push("/dashboard");
      }
    } catch (err) {
      // Error is handled by Redux
      console.error("Signup error:", err);
    } finally {
      setSubmitting(false);
    }
  };

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

          {(localError || authError) && (
            <Alert severity="error" className="mb-4">
              {localError || authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              autoComplete="email"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              autoComplete="new-password"
              helperText="Must be at least 6 characters"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={submitting || authLoading}
              className="bg-purple-600 hover:bg-purple-700 py-3"
              sx={{ mt: 2 }}
            >
              {submitting || authLoading ? (
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
