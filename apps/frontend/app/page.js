"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import { AuthContext } from "./AuthContext"; // Adjust path as needed
import config from "../config";

export default function HomePage() {
  const { user, login, logout } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = e.target;

    try {
      const response = await axios.post(`${config.apiBaseUrl}/login`, {
        username: username.value,
        password: password.value,
      });

      login(response.data.token);
      setModalOpen(false);
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
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

      alert("Signup successful! You can now log in.");
      setAuthMode("login");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  const handleSignOut = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header" style={{ position: "relative" }}>
        <h1 className="home-title">Welcome to </h1>
        <img src="/logo.png" alt="ShopSage Logo" className="home-logo" />
      </header>

      {/* Main Content */}
      <main className="home-main">
        <p className="home-description">
          ShopSage helps you build and manage your grocery lists with ease. Search for items, organize your shopping list, and get a summary of your purchases.
        </p>
        <div className="home-actions">
          <Link href="/list_gen">
            <button className="home-button secondary">Grocery Search</button>
          </Link>
          <Link href="/recommendation">
            <button className="home-button secondary">Shopping List</button>
          </Link>
          {!user ? (
            <button
              className="home-button secondary"
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
                  <Link href="/history"><a>History</a></Link>
                  <Link href="/preferences"><a>Preferences</a></Link>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
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
            <button onClick={() => setModalOpen(false)} className="auth-modal-close">X</button>
          </div>
        </div>
      )}
    </div>
  );
}
