"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { AuthContext } from "../AuthContext"; // adjust path if needed
import axios from "axios";
import config from "../../config";

export default function RecommendationPage() {
  const { user, login, logout } = useContext(AuthContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [groceryItems, setGroceryItems] = useState(["", "", "", "", ""]);
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const generateFromHistory = () => {
    const defaultItems = [
      "Milk", "Eggs", "Bread", "Bananas", "Chicken",
      "Apples", "Cheese", "Rice", "Pasta", "Beef",
    ];
    setGroceryItems(defaultItems);
  };

  const addItemField = () => setGroceryItems([...groceryItems, ""]);

  const removeItemField = (index) => {
    if (groceryItems.length <= 1) return;
    const newItems = [...groceryItems];
    newItems.splice(index, 1);
    setGroceryItems(newItems);
  };

  const updateItem = (index, value) => {
    const newItems = [...groceryItems];
    newItems[index] = value;
    setGroceryItems(newItems);
  };

  const generateShoppingList = async () => {
    const items = groceryItems.filter((i) => i.trim());
    if (!items.length) return alert("Please add at least one item!");

    setLoadingResults(true);
    try {
      const results = await Promise.all(items.map(async (item) => {
        const res = await fetch(`http://localhost:5000/api/getAllProducts?zipCode=47906&searchTerm=${encodeURIComponent(item)}`);
        const data = await res.json();
        return { item, data };
      }));

      const lists = { krogerList: [], meijerList: [], targetList: [] };
      results.forEach(({ data }) => {
        data.forEach(product => {
          if (product.provider === "Kroger") lists.krogerList.push(product);
          if (product.provider === "Meijer") lists.meijerList.push(product);
          if (product.provider === "Target") lists.targetList.push(product);
        });
      });

      setResults(lists);
    } catch (error) {
      console.error("Error generating list:", error);
    } finally {
      setLoadingResults(false);
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

      login(response.data.token); // context method
      setModalOpen(false);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = e.target;

    if (password.value !== confirmPassword.value) {
      return alert("Passwords do not match!");
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
          <Link href="/list_gen">
            <button className="home-nav-button sign-in-btn">Grocery Search</button>
          </Link>
          {!user ? (
            <button className="home-nav-button sign-in-btn" onClick={() => {
              setModalOpen(true);
              setAuthMode("login");
            }}>
              Sign In
            </button>
          ) : (
            <div style={{ position: "relative" }}>
              <button className="home-nav-button" onClick={() => setShowDropdown(prev => !prev)}>
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
      <div className="main-content" style={{ justifyContent: "center" }}>
        <div className="shopping-list" style={{ maxWidth: "800px", width: "100%" }}>
          <h2 className="shopping-header">Add Your Grocery Items</h2>

          <div className="grocery-input-container" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {groceryItems.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={index === groceryItems.length - 1 ? "Add additional item" : "Enter grocery item"}
                  className="search-bar"
                  style={{ flex: 1 }}
                />
                <div className="grocery-button-container">
                  {index !== groceryItems.length - 1 && (
                    <button className="remove-button square-button" onClick={() => removeItemField(index)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                  {index === groceryItems.length - 1 && (
                    <button className="add-button square-button hover-orange" onClick={addItemField}>+</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button className="home-button hover-orange" onClick={generateFromHistory} style={{ width: "50%" }}>
              Generate from History
            </button>
            <button className="home-button hover-orange" onClick={generateShoppingList} style={{ width: "50%" }}>
              {loadingResults ? "Loading…" : "Generate Shopping List"}
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <section style={{ marginTop: "30px" }}>
            <h2>Shopping Lists by Location</h2>
            {["krogerList", "meijerList", "targetList"].map((storeKey) => (
              results[storeKey].length > 0 && (
                <div key={storeKey} className="shopping-list">
                  <h3>{storeKey.replace("List", "")}</h3>
                  {results[storeKey].map((item) => (
                    <div key={item.id} className="shopping-item">
                      <div className="image-placeholder">
                        {item.image_url && <img src={item.image_url} alt={item.name} />}
                      </div>
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <div className="price-quantity">
                          <span className="price">${item.price}</span>
                          <span className="item-location">{item.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))}
          </section>
        )}
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ShopSage. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
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
                  <div><label>Username:</label><input type="text" name="username" required /></div>
                  <div><label>Password:</label><input type="password" name="password" required /></div>
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
                  <div><label>Username:</label><input type="text" name="username" required /></div>
                  <div><label>Password:</label><input type="password" name="password" required /></div>
                  <div><label>Retype Password:</label><input type="password" name="confirmPassword" required /></div>
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
