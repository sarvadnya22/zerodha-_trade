import React from "react";
import { Box, CircularProgress } from "@mui/material";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f5f7fa",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Box sx={{ mt: 2, fontSize: "1.2rem", color: "text.secondary" }}>
          Loading your dashboard...
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <TopBar user={user} />
      <Dashboard user={user} />
    </Box>
  );
};

export default Home;