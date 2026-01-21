import React, { useContext, useState } from "react";
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

import API_URL from "../api";

import GeneralContext from "./GeneralContext";

const BuyActionWindow = ({ uid, stockPrice = 0 }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stockPrice || 0);
  const [orderType, setOrderType] = useState("MARKET");
  const [productType, setProductType] = useState("CNC");
  const [loading, setLoading] = useState(false);

  const { closeBuyWindow } = useContext(GeneralContext);

  // Calculate margin requirement (simplified calculation)
  const calculateMargin = () => {
    const totalValue = quantity * (orderType === "MARKET" ? stockPrice : price);
    const margin = productType === "MIS" ? totalValue * 0.2 : totalValue; // 20% for MIS, 100% for CNC
    return margin.toFixed(2);
  };

  const handleBuyClick = async () => {
    // Validation
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (orderType !== "MARKET" && price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/newOrder`,
        {
          name: uid,
          qty: quantity,
          price: orderType === "MARKET" ? stockPrice : price,
          mode: "BUY",
          orderType: orderType,
          productType: productType,
        },
        { withCredentials: true }
      );

      toast.success(`Successfully bought ${quantity} shares of ${uid}`);
      closeBuyWindow();
    } catch (error) {
      console.error("Error placing buy order:", error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={closeBuyWindow}
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
          bgcolor: "#4184f3",
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
          onClick={closeBuyWindow}
          sx={{ color: "white" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* Order Type Selection */}
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

        {/* Product Type Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Product Type</InputLabel>
          <Select
            value={productType}
            label="Product Type"
            onChange={(e) => setProductType(e.target.value)}
          >
            <MenuItem value="CNC">CNC (Delivery)</MenuItem>
            <MenuItem value="MIS">MIS (Intraday)</MenuItem>
            <MenuItem value="NRML">NRML (Normal)</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {/* Quantity Input */}
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            fullWidth
            inputProps={{ min: 1, step: 1 }}
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

        <Divider sx={{ my: 2 }} />

        {/* Summary */}
        <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Value
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              ₹{(quantity * (orderType === "MARKET" ? stockPrice : price)).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Margin Required
            </Typography>
            <Typography variant="body2" fontWeight={500} color="primary">
              ₹{calculateMargin()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={closeBuyWindow}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleBuyClick}
          variant="contained"
          disabled={loading}
          sx={{
            minWidth: 100,
            bgcolor: "#4184f3",
            "&:hover": { bgcolor: "#3367d6" },
          }}
        >
          {loading ? "Placing..." : "Buy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyActionWindow;
