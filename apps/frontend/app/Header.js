"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "./AuthContext"; // Adjust path if needed

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="header">
      <Link href="/">
        <img src="/logo.png" alt="ShopSage Logo" className="logo-centered" />
      </Link>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Link href="/list_gen">
          <button className="home-nav-button sign-in-btn">Grocery Search</button>
        </Link>
        <Link href="/recommendation">
          <button className="home-nav-button sign-in-btn">Generate Shopping List</button>
        </Link>
        {!user ? (
          <button
            className="home-nav-button sign-in-btn"
            onClick={() => alert("Sign-in modal not implemented here.")}
          >
            Sign In
          </button>
        ) : (
          <div style={{ position: "relative" }}>
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
                <button className="dropdown-item" onClick={logout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}