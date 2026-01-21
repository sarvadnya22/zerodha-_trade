import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import API_URL from "../api";

const Funds = () => {
  const [loading, setLoading] = useState(true);
  const [fundsData, setFundsData] = useState({
    availableMargin: 3740,
    usedMargin: 0,
    availableCash: 3740,
    openingBalance: 3740,
  });

  useEffect(() => {
    calculateMargins();
  }, []);

  const calculateMargins = async () => {
    setLoading(true);
    try {
      const { data: orders } = await axios.get(`${API_URL}/allOrders`, {
        withCredentials: true,
      });

      // Calculate used margin from open positions
      const stockMap = {};
      orders.forEach((order) => {
        if (!stockMap[order.name]) {
          stockMap[order.name] = { buyQty: 0, sellQty: 0, totalBuyValue: 0 };
        }
        if (order.mode === "BUY") {
          stockMap[order.name].buyQty += order.qty;
          stockMap[order.name].totalBuyValue += order.qty * order.price;
        } else if (order.mode === "SELL") {
          stockMap[order.name].sellQty += order.qty;
        }
      });

      // Calculate total used margin (invested in open positions)
      let usedMargin = 0;
      Object.values(stockMap).forEach((stock) => {
        const netQty = stock.buyQty - stock.sellQty;
        if (netQty > 0) {
          const avgPrice = stock.totalBuyValue / stock.buyQty;
          usedMargin += netQty * avgPrice;
        }
      });

      const openingBalance = 3740; // Mock opening balance
      const availableMargin = openingBalance - usedMargin;

      setFundsData({
        availableMargin: Math.max(0, availableMargin),
        usedMargin: usedMargin,
        availableCash: Math.max(0, availableMargin),
        openingBalance: openingBalance,
      });
    } catch (error) {
      console.error("Error calculating margins:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Funds
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Instant, zero-cost fund transfers with UPI
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          sx={{ minWidth: 150 }}
        >
          Add Funds
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RemoveIcon />}
          sx={{ minWidth: 150 }}
        >
          Withdraw
        </Button>
      </Box>

      {/* Equity Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AccountBalanceWalletIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" fontWeight={600}>
                Equity
              </Typography>
            </Box>

            {/* Main Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: "#e8f5e9", textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Available Margin
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="success.main">
                    ₹{fundsData.availableMargin.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: "#fff3e0", textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Used Margin
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="warning.main">
                    ₹{fundsData.usedMargin.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: "#e3f2fd", textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Available Cash
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="primary.main">
                    ₹{fundsData.availableCash.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Detailed Breakdown */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Account Details
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Opening Balance
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹{fundsData.openingBalance.toLocaleString("en-IN")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Payin
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹0.00
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Payout
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹0.00
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  SPAN
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹0.00
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Delivery Margin
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹0.00
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Exposure
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹0.00
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Commodity Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f5f5f5" }}>
            <TrendingUpIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Commodity Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You don't have a commodity account
            </Typography>
            <Button variant="contained" color="primary">
              Open Account
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Funds;
