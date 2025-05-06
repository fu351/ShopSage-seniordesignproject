"use client";
import React, { useState, useEffect, useContext } from "react";
import config from "../../config";
import { AuthContext } from "../AuthContext"; // Adjust the path if needed
import Header from "../Header"; // Import the Header component

export default function ShoppingHistory() {
  const { user } = useContext(AuthContext);
  const [shoppingHistory, setShoppingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchShoppingHistory();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchShoppingHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${config.apiBaseUrl}/getShoppingLists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shopping history");
      }

      const data = await response.json();
      setShoppingHistory(data);
    } catch (error) {
      console.error("Error fetching shopping history:", error);
      alert("Could not fetch shopping history.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="history-container">
        <Header />
        <h1>Shopping History</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="history-container">
        <Header />
        <h1>Shopping History</h1>
        <p>You must be signed in to view your shopping history.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <Header />
      <h1>Shopping History</h1>
      {shoppingHistory.length === 0 ? (
        <p>No shopping history available.</p>
      ) : (
        shoppingHistory.map((list) => (
          <div key={list.listId} className="history-item">
            <h3>{new Date(list.createdAt).toLocaleString()}</h3>
            <ul>
              {list.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}</strong> &times; {item.quantity} — $
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}