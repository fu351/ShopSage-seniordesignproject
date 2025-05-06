"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react"; // Import Trash2 icon

export default function RecommendationPage() {
  // State for current user, login modal, profile dropdown and authentication mode
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  
  // New state for grocery items - initialize with 5 empty fields
  const [groceryItems, setGroceryItems] = useState(["", "", "", "", ""]);

  // Function to add a new item field
  const addItemField = () => {
    setGroceryItems([...groceryItems, ""]);
  };

  // Function to remove an item field
  const removeItemField = (index) => {
    if (groceryItems.length <= 1) return; // Always keep at least one field
    const newItems = [...groceryItems];
    newItems.splice(index, 1);
    setGroceryItems(newItems);
  };

  // Function to update an item value
  const updateItem = (index, value) => {
    const newItems = [...groceryItems];
    newItems[index] = value;
    setGroceryItems(newItems);
  };

  // Function to handle generating shopping list
  const generateShoppingList = () => {
    // Filter out empty items
    const items = groceryItems.filter(item => item.trim() !== "");
    if (items.length === 0) {
      alert("Please add at least one item to your grocery list!");
      return;
    }
    console.log("Generating shopping list with items:", items);
    // Here you would implement the logic to generate the shopping list
  };

  // Dummy handlers: replace with your actual API calls
  const handleLogin = (e) => {
    e.preventDefault();
    // ...perform login authentication...
    setUser({ username: e.target.username.value });
    setModalOpen(false);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // ...perform signup logic and validations...
    const { username, password, confirmPassword } = e.target;
    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match!");
      return;
    }
    // Assume successful signup, automatically sign the user in
    setUser({ username: username.value });
    setModalOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <Link href="/">
          <img src="/logo.png" alt="ShopSage Logo" className="logo-centered" />
        </Link>
        
        {/* Authentication Controls */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link href="/list_gen">
            <button className="home-nav-button sign-in-btn">Grocery Search</button>
          </Link>
          
          {!user ? (
            <button
              className="home-nav-button sign-in-btn"
              onClick={() => {
                setModalOpen(true);
                setAuthMode("login");
              }}
            >
              Sign In
            </button>
          ) : (
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                className="home-nav-button"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.username}
              </button>
              {showDropdown && (
                <div className="auth-dropdown">
                  <Link href="/preferences">
                    <div className="dropdown-item">Preferences</div>
                  </Link>
                  <Link href="/history">
                    <div className="dropdown-item">View History</div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                    className="dropdown-item"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Right Column Only */}
      <div className="main-content" style={{ justifyContent: "center" }}>
        {/* Grocery Item Input */}
        <div className="shopping-list" style={{ maxWidth: "800px", width: "100%" }}>
          <h2 className="shopping-header">Add Your Grocery Items</h2>
          <div className="grocery-input-container" style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "10px",
            marginBottom: "20px"
          }}>
            {groceryItems.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={index === groceryItems.length - 1 ? "Add additional item" : "Enter grocery item"}
                  className="search-bar"
                  style={{ flex: 1, margin: 0 }}
                />
                <div className="grocery-button-container">
                  {index !== groceryItems.length - 1 && (
                    <button 
                      className="remove-button square-button"
                      onClick={() => removeItemField(index)}
                      aria-label="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {index === groceryItems.length - 1 && (
                    <button 
                      className="add-button square-button hover-orange"
                      onClick={addItemField}
                      aria-label="Add new item"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Side-by-side buttons container */}
          <div style={{ 
            display: "flex", 
            gap: "10px", 
            marginTop: "20px" 
          }}>
            <button 
              className="home-button hover-orange"
              onClick={() => console.log("Generate from history")}
              style={{ width: "50%" }}
            >
              Generate from History
            </button>
            
            <button 
              className="home-button hover-orange"
              onClick={generateShoppingList}
              style={{ width: "50%" }}
            >
              Generate Shopping List
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ShopSage. All rights reserved.</p>
      </footer>

      {/* Login/Signup Modal */}
      {modalOpen && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-container">
            {authMode === "signup" && (
              <button onClick={() => setAuthMode("login")} className="auth-modal-back">
                &larr; Back
              </button>
            )}
            {authMode === "login" ? (
              <>
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                  <div>
                    <label>Username:</label>
                    <input type="text" name="username" required />
                  </div>
                  <div>
                    <label>Password:</label>
                    <input type="password" name="password" required />
                  </div>
                  <div className="modal-buttons">
                    <button type="submit" className="home-button secondary">Login</button>
                    <button
                      type="button"
                      className="home-button secondary"
                      onClick={() => setAuthMode("signup")}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                  <div>
                    <label>Username:</label>
                    <input type="text" name="username" required />
                  </div>
                  <div>
                    <label>Password:</label>
                    <input type="password" name="password" required />
                  </div>
                  <div>
                    <label>Retype Password:</label>
                    <input type="password" name="confirmPassword" required />
                  </div>
                  <div className="modal-buttons">
                    <button type="submit" className="home-button secondary">Sign Up</button>
                  </div>
                </form>
              </>
            )}
            <button onClick={() => setModalOpen(false)} className="auth-modal-close">
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}