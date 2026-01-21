import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow, IconButton } from "@mui/material";
import { watchlist } from "../data/data";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { DoughnutChart } from "./DoughnoutChart";

const WatchList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Filter watchlist based on search query
  const filteredWatchlist = watchlist.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define color palette with increased opacity (0.7)
  const colorPalette = [
    { bg: 'rgba(229, 35, 77, 0.7)', border: 'rgba(229, 35, 77, 1)' },
    { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(255, 206, 86, 0.7)', border: 'rgba(255, 206, 86, 1)' },
    { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(153, 102, 255, 0.7)', border: 'rgba(153, 102, 255, 1)' },
    { bg: 'rgba(255, 159, 64, 0.7)', border: 'rgba(255, 159, 64, 1)' },
  ];

  // Generate colors for filtered stocks - maintain original index
  const getColors = () => {
    const bgColors = [];
    const borderColors = [];
    filteredWatchlist.forEach((stock) => {
      // Find the original index of this stock in the full watchlist
      const originalIndex = watchlist.findIndex(s => s.name === stock.name);
      const colorIndex = originalIndex % colorPalette.length;
      bgColors.push(colorPalette[colorIndex].bg);
      borderColors.push(colorPalette[colorIndex].border);
    });
    return { bgColors, borderColors };
  };

  const { bgColors, borderColors } = getColors();

  const data = {
    labels: filteredWatchlist.map((stock) => stock.name),
    datasets: [
      {
        label: 'Price',
        data: filteredWatchlist.map((stock) => stock.price),
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1,
      },]
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Dark mode styles
  const containerStyle = {
    backgroundColor: darkMode ? '#1a1a1a' : 'white',
    color: darkMode ? '#e0e0e0' : 'inherit',
    transition: 'all 0.3s ease',
  };

  const searchStyle = {
    backgroundColor: darkMode ? '#2d2d2d' : 'white',
    color: darkMode ? '#e0e0e0' : 'inherit',
    borderColor: darkMode ? '#404040' : '#e0e0e0',
    textAlign: 'center',
    paddingLeft: '40px',
  };

  const listItemStyle = {
    borderBottomColor: darkMode ? '#2d2d2d' : '#f0f0f0',
  };

  return (
    <div className="watchlist-container" style={containerStyle}>
      <div className="search-container" style={{ position: 'relative' }}>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search stocks..."
          className="search"
          value={searchQuery}
          onChange={handleSearchChange}
          style={searchStyle}
        />
        <span className="counts" style={{ color: darkMode ? '#999' : 'inherit' }}>
          {filteredWatchlist.length} / {watchlist.length}
        </span>

        {/* Dark Mode Toggle - Left Side */}
        <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} placement="top">
          <IconButton
            onClick={toggleDarkMode}
            size="small"
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: darkMode ? '#ffa726' : '#1976d2',
              zIndex: 1,
            }}
          >
            {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </div>

      <ul className="list">
        {filteredWatchlist.length > 0 ? (
          filteredWatchlist.map((stock, index) => {
            return <WatchListItem stock={stock} key={index} darkMode={darkMode} listItemStyle={listItemStyle} />;
          })
        ) : (
          <li style={{ padding: "20px", textAlign: "center", color: darkMode ? "#666" : "#999" }}>
            No stocks found
          </li>
        )}
      </ul>
      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, darkMode, listItemStyle }) => {
  const [showWatchListActions, setShowWatchListActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchListActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchListActions(false);
  };

  const itemHoverStyle = {
    backgroundColor: showWatchListActions ? (darkMode ? '#2d2d2d' : '#f5f5f5') : 'transparent',
  };

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...listItemStyle, ...itemHoverStyle, transition: 'background-color 0.2s ease' }}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"} style={{ color: darkMode ? (stock.isDown ? '#ef5350' : '#66bb6a') : undefined }}>
          {stock.name}
        </p>
        <div className="ItemInfo">
          <span className="percent" style={{ color: darkMode ? '#b0b0b0' : undefined }}>{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" sx={{ color: darkMode ? '#ef5350' : undefined }} />
          ) : (
            <KeyboardArrowUp className="up" sx={{ color: darkMode ? '#66bb6a' : undefined }} />
          )}
        </div>
      </div>
      {showWatchListActions && <WatchListActions uid={stock.name} darkMode={darkMode} />}
    </li>
  );
};

const WatchListActions = ({ uid, darkMode }) => {
  const generalContext = useContext(GeneralContext);

  // Find stock price from watchlist
  const stock = watchlist.find(s => s.name === uid);
  const stockPrice = stock ? stock.price : 0;

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid, stockPrice);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(uid, stockPrice);
  }

  const buttonStyle = {
    filter: darkMode ? 'brightness(1.1)' : 'none',
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy" style={buttonStyle}>Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleSellClick}
        >
          <button className="sell" style={buttonStyle}>Sell</button>
        </Tooltip>
      </span>
    </span>
  );
};