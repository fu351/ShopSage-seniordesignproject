"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function HomePage() {
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

  return (
    <div className="home-container">

      {/* Header */}
      <header className="home-header" style={{ position: "relative" }}>
        <h1 className="home-title">Welcome to </h1>
        <img src="/logo.png" alt="ShopSage Logo" className="home-logo" />
        {/* New top-right authentication area */}
      </header>

      {/* Main Content */}
      <main className="home-main">
        <p className="home-description">
          ShopSage helps you build and manage your grocery lists with ease. Search for items, organize your shopping list, and get a summary of your purchases.
        </p>
        <div className="home-actions">
          <Link href="/list_gen">
            <button className="home-button secondary">Start Building Your List</button>
          </Link>
          <Link href="/about">
            <button className="home-button secondary">Learn More</button>
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
                  <Link href="/history">
                    <a>History</a>
                  </Link>
                  <Link href="/preferences">
                    <a>Preferences</a>
                  </Link>
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
            <button onClick={() => setModalOpen(false)} className="auth-modal-close">
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}