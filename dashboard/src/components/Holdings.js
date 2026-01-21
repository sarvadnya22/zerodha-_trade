import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import toast from "react-hot-toast";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import { VerticalGraph } from "./VerticalGraph";
import { watchlist } from "../data/data";

import API_URL from "../api";

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/allOrders`, {
        withCredentials: true,
      });

      // Group orders by stock name
      const stockMap = {};

      data.forEach((order) => {
        if (!stockMap[order.name]) {
          stockMap[order.name] = {
            name: order.name,
            buyQty: 0,
            sellQty: 0,
            totalBuyValue: 0,
            lastAction: null,
          };
        }

        if (order.mode === "BUY") {
          stockMap[order.name].buyQty += order.qty;
          stockMap[order.name].totalBuyValue += order.qty * order.price;
        } else if (order.mode === "SELL") {
          stockMap[order.name].sellQty += order.qty;
        }

        // Track the last action
        stockMap[order.name].lastAction = order.mode;
      });

      // Calculate net holdings
      const calculatedHoldings = Object.values(stockMap)
        .map((stock) => {
          const netQty = stock.buyQty - stock.sellQty;
          if (netQty <= 0) return null; // Skip if fully sold

          const avgPrice = stock.totalBuyValue / stock.buyQty;

          // Get current price from watchlist (or use avg price as fallback)
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
            currentValue: currentValue,
            profitLoss: profitLoss,
            profitLossPercent: profitLossPercent,
            isProfit: profitLoss >= 0,
            lastAction: stock.lastAction,
          };
        })
        .filter((h) => h !== null); // Remove null entries

      setHoldings(calculatedHoldings);
    } catch (error) {
      console.error("Error fetching holdings:", error);
      toast.error("Failed to fetch holdings");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalInvestment = holdings.reduce((sum, h) => sum + h.qty * h.avg, 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalProfitLoss = totalCurrentValue - totalInvestment;
  const totalProfitLossPercent =
    totalInvestment > 0 ? ((totalProfitLoss / totalInvestment) * 100).toFixed(2) : 0;

  // Chart data
  const labels = holdings.map((h) => h.name);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Current Value",
        data: holdings.map((h) => h.currentValue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
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

  if (holdings.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No Holdings Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start buying stocks to see your holdings here
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Holdings ({holdings.length})
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Paper sx={{ p: 3, flex: 1, minWidth: 200 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Investment
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            ₹
            {totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, flex: 1, minWidth: 200 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Value
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            ₹
            {totalCurrentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 3,
            flex: 1,
            minWidth: 200,
            bgcolor: totalProfitLoss >= 0 ? "#e8f5e9" : "#ffebee",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total P&L
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {totalProfitLoss >= 0 ? (
              <TrendingUpIcon sx={{ color: "success.main" }} />
            ) : (
              <TrendingDownIcon sx={{ color: "error.main" }} />
            )}
            <Typography
              variant="h5"
              fontWeight={600}
              color={totalProfitLoss >= 0 ? "success.main" : "error.main"}
            >
              ₹
              {Math.abs(totalProfitLoss).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography
              variant="body1"
              color={totalProfitLoss >= 0 ? "success.main" : "error.main"}
            >
              ({totalProfitLossPercent}%)
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Holdings Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>
                <strong>Instrument</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Qty</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Avg Cost</strong>
              </TableCell>
              <TableCell align="right">
                <strong>LTP</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Current Value</strong>
              </TableCell>
              <TableCell align="right">
                <strong>P&L</strong>
              </TableCell>
              <TableCell align="right">
                <strong>P&L %</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Last Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.map((stock, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
              >
                <TableCell>
                  <Typography fontWeight={500}>{stock.name}</Typography>
                </TableCell>
                <TableCell align="right">{stock.qty}</TableCell>
                <TableCell align="right">₹{stock.avg.toFixed(2)}</TableCell>
                <TableCell align="right">₹{stock.price.toFixed(2)}</TableCell>
                <TableCell align="right">₹{stock.currentValue.toFixed(2)}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: stock.isProfit ? "success.main" : "error.main",
                    fontWeight: 500,
                  }}
                >
                  {stock.isProfit ? "+" : ""}₹{stock.profitLoss.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${stock.isProfit ? "+" : ""}${stock.profitLossPercent}%`}
                    size="small"
                    color={stock.isProfit ? "success" : "error"}
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={stock.lastAction}
                    size="small"
                    color={stock.lastAction === "BUY" ? "success" : "error"}
                    sx={{ fontWeight: 500, minWidth: 60 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chart */}
      {holdings.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Portfolio Distribution
          </Typography>
          <VerticalGraph data={chartData} />
        </Box>
      )}
    </Box>
  );
};

export default Holdings;
