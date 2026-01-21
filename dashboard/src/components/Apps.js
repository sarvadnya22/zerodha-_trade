import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import ConstructionIcon from "@mui/icons-material/Construction";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const Apps = () => {
  const comingSoonApps = [
    {
      name: "Market Analytics",
      description: "Advanced charts and technical analysis tools",
      icon: <AppsIcon sx={{ fontSize: 50 }} />,
    },
    {
      name: "Trading Bots",
      description: "Automated trading strategies and algorithms",
      icon: <RocketLaunchIcon sx={{ fontSize: 50 }} />,
    },
    {
      name: "Portfolio Tracker",
      description: "Track and analyze your portfolio performance",
      icon: <ConstructionIcon sx={{ fontSize: 50 }} />,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Apps & Integrations
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Enhance your trading experience with powerful tools and integrations
      </Typography>

      {/* Coming Soon Banner */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom>
          🚀 Coming Soon
        </Typography>
        <Typography variant="body1">
          We're working on exciting new apps and integrations to enhance your trading
          experience
        </Typography>
      </Paper>

      {/* App Cards */}
      <Grid container spacing={3}>
        {comingSoonApps.map((app, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <Box sx={{ color: "primary.main", mb: 2 }}>{app.icon}</Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {app.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {app.description}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  py: 0.5,
                  px: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  display: "inline-block",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Coming Soon
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Additional Info */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: "#f9f9f9" }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          What to Expect
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  mt: 1,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  Third-Party Integrations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with popular trading platforms and tools
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  mt: 1,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  Custom Indicators
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and share your own technical indicators
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  mt: 1,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  API Access
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Build your own apps using our trading API
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  mt: 1,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  Mobile Apps
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trade on the go with our mobile applications
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Apps;