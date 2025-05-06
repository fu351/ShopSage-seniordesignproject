"use client";
import React, { useState, useEffect, useContext } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import config from "../../config";
import axios from "axios";
import { AuthContext } from "../AuthContext"; // Adjust path if needed

export default function Home() {
  const { user, login, logout } = useContext(AuthContext);

  const [shoppingList, setShoppingList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shoppingHistory, setShoppingHistory] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    if (user) fetchShoppingHistory();
  }, [user]);

  const handleSearchDirect = async (query) => {
    setLastSearch(query);
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAllProducts?zipCode=47906&searchTerm=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      const sortedResults = data.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
      setSearchResults(sortedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") handleSearchDirect(searchQuery);
  };

  const addToShoppingList = (item) => {
    setShoppingList((prevList) => {
      const exists = prevList.some(i => i.id === item.id);
      return exists
        ? prevList
        : [...prevList, { ...item, quantity: 1, location: item.location, search: lastSearch }];
    });
  };

  const removeFromShoppingList = (id) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQty) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleViewSimilar = (item) => {
    setSearchQuery(item.search);
    handleSearchDirect(item.search);
  };

  const saveShoppingList = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Consider storing in AuthContext instead
      if (!token) return alert("You must be logged in to save your list.");

      const response = await fetch(`${config.apiBaseUrl}/saveShoppingList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: shoppingList }),
      });

      if (!response.ok) throw new Error("Failed to save shopping list");

      alert("Shopping list saved!");
      fetchShoppingHistory();
    } catch (err) {
      console.error("Error saving list:", err);
      alert("Could not save list.");
    }
  };

  const fetchShoppingHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${config.apiBaseUrl}/getShoppingLists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setShoppingHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      alert("Could not fetch shopping history.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = e.target;
    try {
      const response = await axios.post(`${config.apiBaseUrl}/login`, {
        username: username.value,
        password: password.value,
      });

      login(response.data.token); // use context method
      setModalOpen(false);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = e.target;
    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${config.apiBaseUrl}/register`, {
        username: username.value,
        password: password.value,
      });

      alert("Signup successful! Please log in.");
      setAuthMode("login");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <Link href="/">
          <img src="/logo.png" alt="ShopSage Logo" className="logo-centered" />
        </Link>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link href="/recommendation">
            <button className="home-nav-button sign-in-btn">Generate Shopping List</button>
          </Link>
          {!user ? (
            <button onClick={() => { setModalOpen(true); setAuthMode("login"); }} className="home-nav-button sign-in-btn">Sign In</button>
          ) : (
            <div style={{ position: "relative" }}>
              <button className="home-nav-button user-button" onClick={() => setShowDropdown(!showDropdown)}>
                {user.username}
              </button>
              {showDropdown && (
                <div className="auth-dropdown">
                  <Link href="/preferences"><div className="dropdown-item">Preferences</div></Link>
                  <Link href="/history"><div className="dropdown-item">View History</div></Link>
                  <button className="dropdown-item" onClick={logout}>Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Sidebar Search */}
        <aside className="sidebar">
          <h2 className="search-header">Grocery Search</h2>
          <input
            type="text"
            className="search-bar"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            disabled={isLoading}
          />
          <div className="search-results">
            {isLoading ? (
              <div className="loading-icon">Loading...</div>
            ) : (
              searchResults.map((item) => {
                const exists = shoppingList.some((i) => i.id === item.id);
                return (
                  <div key={item.id} className="search-item">
                    <div className="search-image">
                      {item.image_url && <img src={item.image_url} alt="Product" />}
                      <button
                        className={`add-button ${exists ? "disabled" : ""}`}
                        onClick={!exists ? () => addToShoppingList(item) : undefined}
                        disabled={exists}
                      >
                        {exists ? "Added" : "Add"}
                      </button>
                    </div>
                    <div className="search-details">
                      <span className="search-name">{item.name}</span>
                      <span className="search-price">${item.price} / {item.unit || "each"}</span>
                      <span className="search-location">{item.location}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Shopping List Section */}
        <section className="shopping-list">
          <h2 className="shopping-header">Shopping List</h2>
          {Object.entries(
            shoppingList.reduce((acc, item) => {
              const loc = item.location || "N/A";
              acc[loc] = acc[loc] || [];
              acc[loc].push(item);
              return acc;
            }, {})
          ).map(([location, items]) => (
            <div key={location} className="location-section">
              <h3 className="location-header">{location}</h3>
              {items.map((item) => (
                <div key={item.id} className="shopping-item">
                  <div className="image-placeholder">
                    {item.image_url && <img src={item.image_url} alt="Product" />}
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <div className="price-quantity">
                      <span className="price">${item.price}</span>
                      <label>
                        qty
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        />
                      </label>
                    </div>
                    <div className="item-location">{item.location || "N/A"}</div>
                  </div>
                  <div className="actions">
                    <button className="reload-button" onClick={() => handleViewSimilar(item)}>View Similar</button>
                    <button className="remove-button" onClick={() => removeFromShoppingList(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <button onClick={saveShoppingList} className="save-button">Save List</button>
        </section>

        {/* Summary */}
        <section className="checkout-summary">
          <h2>Summary</h2>
          {Object.entries(
            shoppingList.reduce((acc, item) => {
              const loc = item.location || "N/A";
              const cat = item.category || "General";
              acc[loc] = acc[loc] || {};
              acc[loc][cat] = acc[loc][cat] || [];
              acc[loc][cat].push(item);
              return acc;
            }, {})
          ).map(([location, categories]) => (
            <div key={location} className="checkout-location">
              <h3 className="location-header">{location}</h3>
              {Object.entries(categories).map(([cat, items]) => (
                <div key={cat} className="checkout-category">
                  <h4>{cat}</h4>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id} className="checkout-item">
                        <span className="item-info">{item.name} x {item.quantity}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
          <div className="checkout-total">
            <span>Total:</span>
            <span className="total-price">
              ${shoppingList.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </span>
          </div>
        </section>
      </main>

      {/* Login/Signup Modal */}
      {modalOpen && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-container">
            {authMode === "signup" && (
              <button onClick={() => setAuthMode("login")} className="auth-modal-back">&larr; Back</button>
            )}
            {authMode === "login" ? (
              <>
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                  <label>Username:</label>
                  <input type="text" name="username" required />
                  <label>Password:</label>
                  <input type="password" name="password" required />
                  <div className="modal-buttons">
                    <button type="submit" className="home-button secondary">Login</button>
                    <button type="button" className="home-button secondary" onClick={() => setAuthMode("signup")}>Sign Up</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                  <label>Username:</label>
                  <input type="text" name="username" required />
                  <label>Password:</label>
                  <input type="password" name="password" required />
                  <label>Retype Password:</label>
                  <input type="password" name="confirmPassword" required />
                  <div className="modal-buttons">
                    <button type="submit" className="home-button secondary">Sign Up</button>
                  </div>
                </form>
              </>
            )}
            <button onClick={() => setModalOpen(false)} className="auth-modal-close">X</button>
          </div>
        </div>
      )}
    </div>
  );
}
