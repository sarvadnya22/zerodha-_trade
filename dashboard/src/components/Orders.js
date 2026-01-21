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
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";

import API_URL from "../api";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Buy, 2: Sell

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeTab, allOrders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/allOrders`, {
        withCredentials: true,
      });
      setAllOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeTab === 0) {
      setFilteredOrders(allOrders);
    } else if (activeTab === 1) {
      setFilteredOrders(allOrders.filter((order) => order.mode === "BUY"));
    } else if (activeTab === 2) {
      setFilteredOrders(allOrders.filter((order) => order.mode === "SELL"));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API_URL}/deleteOrder/${orderId}`, {
        withCredentials: true,
      });
      toast.success("Order deleted successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  // Calculate summary stats
  const buyOrders = allOrders.filter((o) => o.mode === "BUY");
  const sellOrders = allOrders.filter((o) => o.mode === "SELL");
  const totalBuyValue = buyOrders.reduce((sum, o) => sum + o.qty * o.price, 0);
  const totalSellValue = sellOrders.reduce((sum, o) => sum + o.qty * o.price, 0);

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
        Orders ({allOrders.length})
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
        <Paper sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: "#e8f5e9" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <ShoppingCartIcon sx={{ color: "success.main", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Total Buy Orders
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {buyOrders.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{totalBuyValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: "#ffebee" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <SellIcon sx={{ color: "error.main", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Total Sell Orders
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {sellOrders.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{totalSellValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: "#e3f2fd" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Net Position
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            ₹
            {(totalBuyValue - totalSellValue).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {buyOrders.length - sellOrders.length} net orders
          </Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`All (${allOrders.length})`} />
          <Tab label={`Buy (${buyOrders.length})`} />
          <Tab label={`Sell (${sellOrders.length})`} />
        </Tabs>
      </Paper>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Stock</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Type</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Price</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Total Value</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Date</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Time</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Order Type</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Product</strong>
                </TableCell>
                {/* <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => {
                const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
                const dateStr = orderDate.toLocaleDateString("en-IN");
                const timeStr = orderDate.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { bgcolor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={500}>{order.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.mode}
                        size="small"
                        color={order.mode === "BUY" ? "success" : "error"}
                        sx={{ fontWeight: 500, minWidth: 60 }}
                      />
                    </TableCell>
                    <TableCell align="right">{order.qty}</TableCell>
                    <TableCell align="right">₹{order.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        ₹{(order.qty * order.price).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{dateStr}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {timeStr}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.orderType || "MARKET"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.productType || "CNC"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    {/* <TableCell align="center">
                      <Tooltip title="Delete Order">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {activeTab === 1 ? "Buy" : activeTab === 2 ? "Sell" : ""} Orders Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start trading to see your orders here
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Orders;
