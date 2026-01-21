import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import GeneralContext from "./GeneralContext";

import API_URL from "../api";

const SellActionWindow = ({ uid, stockPrice = 0 }) => {
  const generalContext = useContext(GeneralContext);
  const [orders, setOrders] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [orderType, setOrderType] = useState("MARKET");
  const [price, setPrice] = useState(stockPrice || 0);
  const [loading, setLoading] = useState(false);
  const [hasStock, setHasStock] = useState(true);

  useEffect(() => {
    // Fetch user's orders to check if they own this stock
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/allOrders`, {
          withCredentials: true,
        });

        // Find all BUY and SELL orders for this stock
        const buyOrders = data.filter((order) => order.name === uid && order.mode === "BUY");
        const sellOrders = data.filter((order) => order.name === uid && order.mode === "SELL");

        if (buyOrders.length > 0) {
          // Calculate total bought quantity and average price
          const totalBought = buyOrders.reduce((sum, order) => sum + order.qty, 0);
          const totalBuyValue = buyOrders.reduce((sum, order) => sum + (order.qty * order.price), 0);
          const avgBuyPrice = totalBuyValue / totalBought;

          // Calculate total sold quantity
          const totalSold = sellOrders.reduce((sum, order) => sum + order.qty, 0);

          // Net position = bought - sold
          const netQty = totalBought - totalSold;

          if (netQty > 0) {
            setOrders({
              name: uid,
              qty: netQty,
              avg: avgBuyPrice,
            });
            setQuantity(netQty); // Default to selling all remaining
            setHasStock(true);
          } else {
            // User has sold all their holdings
            setHasStock(false);
            setOrders(null);
          }
        } else {
          setHasStock(false);
          setOrders(null);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch your orders");
      }
    };

    fetchOrders();
  }, [uid]);

  const calculateProfit = () => {
    if (!orders) return 0;
    const sellValue = quantity * (orderType === "MARKET" ? stockPrice : price);
    const buyValue = quantity * orders.avg;
    return (sellValue - buyValue).toFixed(2);
  };

  const calculateProfitPercent = () => {
    if (!orders) return 0;
    const profit = parseFloat(calculateProfit());
    const buyValue = quantity * orders.avg;
    return ((profit / buyValue) * 100).toFixed(2);
  };

  const handleSellClick = async () => {
    // Check if user owns the stock
    if (!hasStock || !orders) {
      toast.error(`You don't own ${uid}. Buy it first to sell.`);
      return;
    }

    // Validation
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (orders && quantity > orders.qty) {
      toast.error(`You only have ${orders.qty} shares`);
      return;
    }

    if (orderType !== "MARKET" && price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      // Create a SELL order (instead of deleting)
      await axios.post(
        `${API_URL}/sellOrder`,
        {
          name: uid,
          qty: quantity,
          price: orderType === "MARKET" ? stockPrice : price,
          orderType: orderType,
          productType: "CNC",
        },
        { withCredentials: true }
      );

      toast.success(`Successfully sold ${quantity} shares of ${uid}`);
      generalContext.closeSellWindow();
    } catch (err) {
      console.error("Error selling stock:", err);
      toast.error(err.response?.data?.message || "Failed to sell stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const profit = parseFloat(calculateProfit());
  const profitPercent = parseFloat(calculateProfitPercent());
  const isProfit = profit >= 0;

  return (
    <Dialog
      open={true}
      onClose={generalContext.closeSellWindow}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#eb5b3c",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Box>
          <Typography variant="h6" component="div" fontWeight={500}>
            {uid}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            NSE • ₹{stockPrice.toFixed(2)}
          </Typography>
        </Box>
        <IconButton
          onClick={generalContext.closeSellWindow}
          sx={{ color: "white" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* Error message if user doesn't own the stock */}
        {!hasStock && (
          <Box sx={{ bgcolor: "#fff5f5", p: 3, borderRadius: 1, mb: 2, textAlign: "center" }}>
            <Typography variant="h6" color="error.main" gutterBottom>
              You don't own this stock
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You need to buy {uid} first before you can sell it.
            </Typography>
          </Box>
        )}

        {/* Orders Info */}
        {hasStock && orders && (
          <Box sx={{ bgcolor: "#fff5f5", p: 2, borderRadius: 1, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Available Quantity
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {orders.qty} shares
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Avg. Buy Price
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                ₹{orders.avg.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Order Type Selection */}
        {hasStock && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Order Type</InputLabel>
            <Select
              value={orderType}
              label="Order Type"
              onChange={(e) => setOrderType(e.target.value)}
            >
              <MenuItem value="MARKET">Market</MenuItem>
              <MenuItem value="LIMIT">Limit</MenuItem>
              <MenuItem value="SL">Stop-Loss</MenuItem>
            </Select>
          </FormControl>
        )}

        {hasStock && (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {/* Quantity Input */}
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    orders?.qty || 999999,
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                )
              }
              fullWidth
              inputProps={{ min: 1, max: orders?.qty || 999999, step: 1 }}
              helperText={orders ? `Max: ${orders.qty}` : ""}
            />

            {/* Price Input (disabled for Market orders) */}
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              fullWidth
              disabled={orderType === "MARKET"}
              inputProps={{ min: 0, step: 0.05 }}
              helperText={orderType === "MARKET" ? "Market price" : ""}
            />
          </Box>
        )}

        {hasStock && (
          <>
            <Divider sx={{ my: 2 }} />

            {/* Summary */}
            <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Expected Proceeds
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹{(quantity * (orderType === "MARKET" ? stockPrice : price)).toFixed(2)}
                </Typography>
              </Box>
              {orders && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Profit/Loss
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {isProfit ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: "error.main" }} />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color={isProfit ? "success.main" : "error.main"}
                    >
                      ₹{Math.abs(profit).toFixed(2)} ({profitPercent}%)
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={generalContext.closeSellWindow}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          {hasStock ? "Cancel" : "Close"}
        </Button>
        {hasStock && (
          <Button
            onClick={handleSellClick}
            variant="contained"
            disabled={loading || !orders}
            sx={{
              minWidth: 100,
              bgcolor: "#eb5b3c",
              "&:hover": { bgcolor: "#d93025" },
            }}
          >
            {loading ? "Selling..." : "Sell"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SellActionWindow;
