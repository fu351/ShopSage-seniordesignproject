"use client";
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1 className="home-title">Welcome to </h1>
        <img src="/logo.png" alt="ShopSage Logo" className="home-logo" />
        {/* <Link href="/list_gen">
          <button className="home-nav-button">Go to Grocery List Builder</button>
        </Link> */}
      </header>

      {/* Main Content */}
      <main className="home-main">
        <p className="home-description">
          ShopSage helps you build and manage your grocery lists with ease. Search for items, organize your shopping list, and get a summary of your purchases.
        </p>
        <div className="home-actions">
          <Link href="/list_gen">
            <button className="home-button">Start Building Your List</button>
          </Link>
          <Link href="/about">
            <button className="home-button secondary">Learn More</button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} ShopSage. All rights reserved.</p>
      </footer>
    </div>
  );
}