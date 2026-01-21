import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { watchlist } from "../data/data";
import API_URL from "../api";

const Summary = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalInvestment: 0,
    currentValue: 0,
    totalProfitLoss: 0,
    profitLossPercent: 0,
    holdingsCount: 0,
    ordersCount: 0,
    availableFunds: 3740, // Mock value - can be fetched from backend
    recentOrders: [],
    topGainers: [],
    topLosers: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: orders } = await axios.get(`${API_URL}/allOrders`);

      // Calculate holdings
      const stockMap = {};
      orders.forEach((order) => {
        if (!stockMap[order.name]) {
          stockMap[order.name] = {
            name: order.name,
            buyQty: 0,
            sellQty: 0,
            totalBuyValue: 0,
          };
        }

        if (order.mode === "BUY") {
          stockMap[order.name].buyQty += order.qty;
          stockMap[order.name].totalBuyValue += order.qty * order.price;
        } else if (order.mode === "SELL") {
          stockMap[order.name].sellQty += order.qty;
        }
      });

      // Calculate holdings with profit/loss
      const holdings = Object.values(stockMap)
        .map((stock) => {
          const netQty = stock.buyQty - stock.sellQty;
          if (netQty <= 0) return null;

          const avgPrice = stock.totalBuyValue / stock.buyQty;
          const watchlistStock = watchlist.find((s) => s.name === stock.name);
          const currentPrice = watchlistStock ? watchlistStock.price : avgPrice;

          const currentValue = netQty * currentPrice;
          const investedValue = netQty * avgPrice;
          const profitLoss = currentValue - investedValue;
          const profitLossPercent = ((profitLoss / investedValue) * 100).toFixed(2);

          return {
            name: stock.name,
            qty: netQty,
            avg: avgPrice,
            price: currentPrice,
            currentValue,
            profitLoss,
            profitLossPercent: parseFloat(profitLossPercent),
          };
        })
        .filter((h) => h !== null);

      // Calculate totals
      const totalInvestment = holdings.reduce((sum, h) => sum + h.qty * h.avg, 0);
      const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
      const totalProfitLoss = currentValue - totalInvestment;
      const profitLossPercent =
        totalInvestment > 0 ? ((totalProfitLoss / totalInvestment) * 100).toFixed(2) : 0;

      // Get top gainers and losers
      const sortedByProfit = [...holdings].sort(
        (a, b) => b.profitLossPercent - a.profitLossPercent
      );
      const topGainers = sortedByProfit.slice(0, 3);
      const topLosers = sortedByProfit.slice(-3).reverse();

      // Get recent orders (last 5)
      const recentOrders = orders.slice(-5).reverse();

      setDashboardData({
        totalInvestment,
        currentValue,
        totalProfitLoss,
        profitLossPercent: parseFloat(profitLossPercent),
        holdingsCount: holdings.length,
        ordersCount: orders.length,
        availableFunds: 3740, // Mock value
        recentOrders,
        topGainers,
        topLosers,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  const isProfitable = dashboardData.totalProfitLoss >= 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Hi, {user?.displayName || user?.email || "User"}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your portfolio overview
        </Typography>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Available Funds */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: "#e3f2fd" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccountBalanceWalletIcon sx={{ color: "#1976d2", mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Available Funds
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={600}>
              ₹{dashboardData.availableFunds.toLocaleString("en-IN")}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Investment */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: "#f3e5f5" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <ShowChartIcon sx={{ color: "#7b1fa2", mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Total Investment
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={600}>
              ₹
              {dashboardData.totalInvestment.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          </Paper>
        </Grid>

        {/* Current Value */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: "#e8f5e9" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AssessmentIcon sx={{ color: "#388e3c", mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Current Value
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={600}>
              ₹
              {dashboardData.currentValue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          </Paper>
        </Grid>

        {/* Total P&L */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              bgcolor: isProfitable ? "#e8f5e9" : "#ffebee",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {isProfitable ? (
                <TrendingUpIcon sx={{ color: "success.main", mr: 1 }} />
              ) : (
                <TrendingDownIcon sx={{ color: "error.main", mr: 1 }} />
              )}
              <Typography variant="body2" color="text.secondary">
                Total P&L
              </Typography>
            </Box>
            <Typography
              variant="h5"
              fontWeight={600}
              color={isProfitable ? "success.main" : "error.main"}
            >
              {isProfitable ? "+" : ""}₹
              {Math.abs(dashboardData.totalProfitLoss).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </Typography>
            <Typography
              variant="body2"
              color={isProfitable ? "success.main" : "error.main"}
            >
              {isProfitable ? "+" : ""}
              {dashboardData.profitLossPercent}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Holdings & Orders Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Portfolio Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total Holdings
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dashboardData.holdingsCount} stocks
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dashboardData.ordersCount}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Margin Used
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  ₹
                  {dashboardData.totalInvestment.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Top Gainers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Top Gainers
            </Typography>
            {dashboardData.topGainers.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {dashboardData.topGainers.map((stock, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      pb: 2,
                      borderBottom:
                        index < dashboardData.topGainers.length - 1
                          ? "1px solid #e0e0e0"
                          : "none",
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {stock.name}
                    </Typography>
                    <Chip
                      label={`+${stock.profitLossPercent}%`}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No gainers yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Orders
        </Typography>
        {dashboardData.recentOrders.length > 0 ? (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Stock</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Qty</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.name}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.mode}
                        size="small"
                        color={order.mode === "BUY" ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell align="right">{order.qty}</TableCell>
                    <TableCell align="right">₹{order.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      ₹{(order.qty * order.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No orders yet. Start trading to see your activity here!
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Summary;
