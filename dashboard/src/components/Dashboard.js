import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = ({ user }) => {
  return (
    <Box sx={{ display: "flex", flexGrow: 1, bgcolor: "#f5f7fa" }}>
      <GeneralContextProvider>
        {/* WatchList - Visible on mobile, sidebar on desktop */}
        <Box
          sx={{
            width: { xs: "100%", md: 400 },
            borderRight: "1px solid #e0e0e0",
            bgcolor: "white",
            overflowY: "auto",
            height: "calc(100vh - 64px)",
          }}
        >
          <WatchList />
        </Box>
      </GeneralContextProvider>
      {/* Main Content - Hidden on mobile, visible on desktop */}
      <Box sx={{
        display: { xs: "none", md: "block" },
        flexGrow: 1,
        overflowY: "auto",
        height: "calc(100vh - 64px)",
        p: { xs: 1, sm: 2, md: 3 }
      }}>
        <Routes>
          <Route exact path="/" element={<Summary user={user} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;