"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Home() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <Container maxWidth="lg">
        <Box className="text-center">
          <Box className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full shadow-lg">
              <TaskAltIcon className="text-white" style={{ fontSize: 60 }} />
            </div>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            className="font-bold text-gray-800 mb-4"
          >
            Task Manager Dashboard
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                maxWidth: "700px",
                lineHeight: 1.6,
              }}
            >
              Organize your projects and tasks efficiently. Stay productive with
              our intuitive task management system.
            </Typography>
          </Box>

          <Paper
            elevation={3}
            className="p-8 rounded-xl max-w-3xl mx-auto mt-12"
          >
            <Typography
              variant="h5"
              className="font-semibold text-gray-800 mb-6"
            >
              Get Started
            </Typography>

            <Box className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddIcon />}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-8 w-full sm:w-auto"
                >
                  Sign Up
                </Button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-8 w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </Box>
          </Paper>

          <Box className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Paper
              elevation={2}
              className="p-6 rounded-lg hover:shadow-xl transition-shadow"
            >
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-2"
              >
                📊 Project Management
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Create and organize multiple projects with ease
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              className="p-6 rounded-lg hover:shadow-xl transition-shadow"
            >
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-2"
              >
                ✅ Task Tracking
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Add, update, and track tasks within your projects
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              className="p-6 rounded-lg hover:shadow-xl transition-shadow"
            >
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-2"
              >
                🔒 Secure Access
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                JWT-based authentication keeps your data safe
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
