"use client";
import React, { useState, useEffect } from "react";
import config from "../../config";

export default function ShoppingHistory() {
  const [shoppingHistory, setShoppingHistory] = useState([]);

  useEffect(() => {
    fetchShoppingHistory();
  }, []);

  const fetchShoppingHistory = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to view your shopping history.");
      return;
    }

    try {
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
    }
  };

  return (
    <div className="history-container">
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
                  {item.name} x {item.quantity} - ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}