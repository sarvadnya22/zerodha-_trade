import React from "react";
import { AppBar, Toolbar, Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Menu from "./Menu";

const TopBar = ({ user }) => {
  // Mock market data - can be fetched from API
  const marketIndices = [
    { name: "NIFTY 50", value: 100.2, isUp: true },
    { name: "SENSEX", value: 100.2, isUp: true },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "white",
        color: "text.primary",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 56, px: 2 }}>
        {/* Left Side - Logo, Market Indices, Back Arrow */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "2px solid #1976d2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#1976d2",
              }}
            >
              Z
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                display: { xs: "none", sm: "block" },
              }}
            >
              ZenoTrade
            </Typography>
          </Box>

          {/* Market Indices */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {marketIndices.map((index, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                >
                  {index.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: index.isUp ? "success.main" : "error.main",
                  }}
                >
                  {index.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Back Arrow - Optional */}
          <IconButton
            size="small"
            sx={{ display: { xs: "none", lg: "flex" }, color: "primary.main" }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Right Side - Menu Items and User */}
        <Menu user={user} />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;