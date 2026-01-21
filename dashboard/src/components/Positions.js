import React, { useState, useEffect, useContext } from "react";
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
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import API_URL from "../api";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const { data: orders } = await axios.get(`${API_URL}/allOrders`, {
        withCredentials: true,
      });

      // Filter today's orders only
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter((order) => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      // Group by stock to calculate net positions
      const stockMap = {};
      todayOrders.forEach((order) => {
        if (!stockMap[order.name]) {
          stockMap[order.name] = {
            name: order.name,
            buyQty: 0,
            sellQty: 0,
            totalBuyValue: 0,
            totalSellValue: 0,
            productType: order.productType || "CNC",
          };
        }

        if (order.mode === "BUY") {
          stockMap[order.name].buyQty += order.qty;
          stockMap[order.name].totalBuyValue += order.qty * order.price;
        } else if (order.mode === "SELL") {
          stockMap[order.name].sellQty += order.qty;
          stockMap[order.name].totalSellValue += order.qty * order.price;
        }
      });

      // Calculate positions with P&L
      const calculatedPositions = Object.values(stockMap)
        .map((stock) => {
          const netQty = stock.buyQty - stock.sellQty;
          if (netQty === 0) return null; // Skip closed positions

          const avgBuyPrice = stock.totalBuyValue / stock.buyQty;

          // Get current price from watchlist
          const watchlistStock = watchlist.find((s) => s.name === stock.name);
          const currentPrice = watchlistStock ? watchlistStock.price : avgBuyPrice;

          const currentValue = netQty * currentPrice;
          const investedValue = netQty * avgBuyPrice;
          const unrealizedPL = currentValue - investedValue;
          const plPercent = ((unrealizedPL / investedValue) * 100).toFixed(2);

          return {
            name: stock.name,
            qty: netQty,
            avgPrice: avgBuyPrice,
            currentPrice: currentPrice,
            currentValue: currentValue,
            unrealizedPL: unrealizedPL,
            plPercent: parseFloat(plPercent),
            isProfit: unrealizedPL >= 0,
            productType: stock.productType,
          };
        })
        .filter((p) => p !== null);

      setPositions(calculatedPositions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error("Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  };

  const handleExitPosition = (position) => {
    // Open sell window with the position details
    generalContext.openSellWindow(position.name, position.currentPrice);
  };

  // Calculate totals
  const totalInvested = positions.reduce((sum, p) => sum + p.qty * p.avgPrice, 0);
  const totalCurrent = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalUnrealizedPL = totalCurrent - totalInvested;
  const totalPLPercent =
    totalInvested > 0 ? ((totalUnrealizedPL / totalInvested) * 100).toFixed(2) : 0;

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
        Positions ({positions.length})
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Today's intraday positions with unrealized P&L
      </Typography>

      {/* Summary Cards */}
      {positions.length > 0 && (
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          <Paper sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: "#e3f2fd" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Invested
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: "#f3e5f5" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Value
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              ₹{totalCurrent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: 2,
              flex: 1,
              minWidth: 200,
              bgcolor: totalUnrealizedPL >= 0 ? "#e8f5e9" : "#ffebee",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              {totalUnrealizedPL >= 0 ? (
                <TrendingUpIcon sx={{ color: "success.main", mr: 1, fontSize: 20 }} />
              ) : (
                <TrendingDownIcon sx={{ color: "error.main", mr: 1, fontSize: 20 }} />
              )}
              <Typography variant="body2" color="text.secondary">
                Unrealized P&L
              </Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              color={totalUnrealizedPL >= 0 ? "success.main" : "error.main"}
            >
              {totalUnrealizedPL >= 0 ? "+" : ""}₹
              {Math.abs(totalUnrealizedPL).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </Typography>
            <Typography
              variant="body2"
              color={totalUnrealizedPL >= 0 ? "success.main" : "error.main"}
            >
              {totalUnrealizedPL >= 0 ? "+" : ""}
              {totalPLPercent}%
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Positions Table */}
      {positions.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Instrument</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Product</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Qty</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Avg Price</strong>
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
                {/* <TableCell align="center">
                  <strong>Action</strong>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((position, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { bgcolor: "#f9f9f9" },
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={500}>{position.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={position.productType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{position.qty}</TableCell>
                  <TableCell align="right">₹{position.avgPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">₹{position.currentPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    ₹{position.currentValue.toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: position.isProfit ? "success.main" : "error.main",
                      fontWeight: 500,
                    }}
                  >
                    {position.isProfit ? "+" : ""}₹
                    {Math.abs(position.unrealizedPL).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${position.isProfit ? "+" : ""}${position.plPercent}%`}
                      size="small"
                      color={position.isProfit ? "success" : "error"}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  {/* <TableCell align="center">
                    <Tooltip title="Exit Position">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<ExitToAppIcon />}
                        onClick={() => handleExitPosition(position)}
                      >
                        Exit
                      </Button>
                    </Tooltip>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Open Positions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have any open positions today. Start trading to see your intraday
            positions here.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Positions;
