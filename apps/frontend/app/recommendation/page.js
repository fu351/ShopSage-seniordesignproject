"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function RecommendationPage() {
  // State for current user, login modal, profile dropdown and authentication mode
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"

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
    <div className="recommendation-container">

      {/* Header */}
      <header className="recommendation-header" style={{ position: "relative" }}>
        <h1 className="recommendation-title">Your Shopping List</h1>
        <img src="/logo.png" alt="ShopSage Logo" className="recommendation-logo" />
      </header>

      {/* Main Content */}
      <main className="recommendation-main">
        <p className="recommendation-description">
          Here are your recommended items based on your preferences and history.
        </p>
        <div className="recommendation-actions">
          <Link href="/list_gen">
            <button className="recommendation-button secondary">Grocery Search</button>
          </Link>
          <Link href="/history">
            <button className="recommendation-button secondary">History</button>
          </Link>
          {!user ? (
            <button
              className="recommendation-button secondary"
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
                className="recommendation-nav-button"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.username}
              </button>
              {showDropdown && (
                <div className="auth-dropdown">
                  <Link href="/preferences">
                    <a>Preferences</a>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="recommendation-footer">
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
                    <button type="submit" className="recommendation-button secondary">Login</button>
                    <button
                      type="button"
                      className="recommendation-button secondary"
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
                    <button type="submit" className="recommendation-button secondary">Sign Up</button>
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