"use client";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // Import the reload icon
import Link from "next/link";
import config from "../../config";
export default function Home() {
  const [shoppingList, setShoppingList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shoppingHistory, setShoppingHistory] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const commonSearches = [
    "Milk",
    "Eggs",
    "Bread",
    "Bananas",
    "Chicken",
    "Apples",
    "Cheese",
    "Rice",
    "Pasta",
    "Butter",
    "Beef",
    "Yogurt",
    "Tomatoes",
    "Coffee"
  ];

  function getRandomItem(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const handleGenerateRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const searchTerm = getRandomItem(commonSearches)
      const response = await fetch(
        `http://localhost:5000/api/getAllProducts?zipCode=47906&searchTerm=${encodeURIComponent(searchTerm)}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch recommended products");
      }
  
      const data = await response.json();
      // Build a map of provider -> cheapest item
      const cheapestByProvider = data.reduce((map, item) => {
        const price = item.price ?? Infinity;
        const provider = item.provider;
        const existing = map.get(provider);
  
        if (!existing || price < (existing.price ?? Infinity)) {
          map.set(provider, item);
        }
        return map;
      }, new Map());
  
      // Convert back to array of items
      const uniqueCheapestItems = Array.from(cheapestByProvider.values());
      setRecommendedItems(uniqueCheapestItems);

    } catch (error) {
      // console.error("Error fetching recommended items:", error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchShoppingHistory
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setShoppingList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleViewSimilar = (item) => {
    setSearchQuery(item.search);
    handleSearchDirect(item.search);
  };

  const handleSearchDirect = async (query) => {
    setLastSearch(query);
    if (query.trim() !== "") {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/getAllProducts?zipCode=47906&searchTerm=${encodeURIComponent(query)}`);
        //const response = await fetch(`${config.apiBaseUrl}/getAllProducts?zipCode=47906&searchTerm=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const sortedResults = data.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
        setSearchResults(sortedResults);
      } catch (error) {
        // console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      handleSearchDirect(searchQuery);
    }
  };

  const addToShoppingList = (item) => {
    setShoppingList((prevList) => {
      const itemExists = prevList.some(
        (existingItem) => existingItem.id === item.id
      );
      if (!itemExists) {
        return [
          ...prevList,
          {
            ...item,
            quantity: 1,
            location: item.location,
            search: lastSearch,
          },
        ];
      }
      return prevList;
    });
  };

  const saveShoppingList = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to save your shopping list.");
      return;
    }
  
    try {
      const response = await fetch(`${config.apiBaseUrl}/saveShoppingList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: shoppingList }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save shopping list");
      }
  
      const data = await response.json();
      alert("Shopping list saved successfully!");
      fetchShoppingHistory(); // Refresh the shopping history
    } catch (error) {
      console.error("Error saving shopping list:", error);
      alert("Could not save shopping list.");
    }
  };

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
      console.log("Shopping History:", data);
      // Update state to display the history
      setShoppingHistory(data);
    } catch (error) {
      console.error("Error fetching shopping history:", error);
      alert("Could not fetch shopping history.");
    }
  };

  const removeFromShoppingList = (id) => {
    setShoppingList((prevList) => prevList.filter((item) => item.id !== id));
  };

  return (
    <div className="page-container">
      {/* Header with Logo */}
      <header className="header">
        <Link href="..">
        <img src="/logo.png" alt="ShopSage Logo" className="logo-centered" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Sidebar */}
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
                const itemExists = shoppingList.some(
                  (existingItem) => existingItem.id === item.id
                );
                return (
                  <div key={item.id} className="search-item">
                    {/* Left Column: Image and Add Button */}
                    <div className="search-image">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt="Product Thumbnail"
                        />
                      )}
                      <button
                        className={`add-button ${itemExists ? "disabled" : ""}`}
                        onClick={!itemExists ? () => addToShoppingList(item) : undefined}
                        disabled={itemExists}
                      >
                        {itemExists ? "Added" : "Add"}
                      </button>
                    </div>

                    {/* Right Column: Name, Price, and Location */}
                    <div className="search-details">
                      <span className="search-name">{item.name}</span>
                      <span className="search-price">
                        ${item.price} / {item.unit || "each"}
                      </span>
                      <span className="search-location">{item.location}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recommended Products Section */}
          <h3 className="gen-header">Recommended for You</h3>
          <button
              className="gen-button"
              onClick={handleGenerateRecommendations}
              disabled={isLoadingRecommendations}
            >
              {isLoadingRecommendations ? "Generating..." : "Generate Recommendations"}
          </button>
          <div className="recommended-section">
            {recommendedItems.length === 0 && !isLoadingRecommendations ? (
              <div className="empty-recommendations">No recommendations yet.</div>
            ) : (
              recommendedItems.map((item) => {
                const itemExists = shoppingList.some(
                  (existingItem) => existingItem.id === item.id
                );
                return (
                  <div key={item.id} className="search-item">
                    <div className="search-image">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt="Recommended Product"
                        />
                      )}
                      <button
                        className={`add-button ${itemExists ? "disabled" : ""}`}
                        onClick={!itemExists ? () => addToShoppingList(item) : undefined}
                        disabled={itemExists}
                      >
                        {itemExists ? "Added" : "Add"}
                      </button>
                    </div>
                    <div className="search-details">
                      <span className="search-name">{item.name}</span>
                      <span className="search-price">
                        ${item.price} / {item.unit || "each"}
                      </span>
                      <span className="search-location">{item.location}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Shopping List */}
        <section className="shopping-list">
          <h2 className="shopping-header">Shopping List</h2>
          {(() => {
            const groupedByLocation = shoppingList.reduce((acc, item) => {
              const location = item.location || "N/A";
              if (!acc[location]) {
                acc[location] = [];
              }
              acc[location].push(item);
              return acc;
            }, {});

            return Object.entries(groupedByLocation).map(([location, items]) => (
              <div key={location} className="location-section">
                <h3 className="location-header">{location}</h3>
                {items.map((item) => (
                  <div key={item.id} className="shopping-item">
                    <div className="image-placeholder">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt="Product Thumbnail"
                        />
                      )}
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
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="item-location">
                        {item.location || "N/A"}
                      </div>
                    </div>
                    <div className="actions">
                      <button
                        className="reload-button"
                        onClick={() => handleViewSimilar(item)}
                      >
                        View Similar
                      </button>
                      <button
                        className="remove-button"
                        onClick={() => removeFromShoppingList(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ));
          })()}
          <button onClick={saveShoppingList} className="save-button">
            Save List
          </button>
        </section>

        {/* Checkout Summary */}
        <section className="checkout-summary">
          <h2>Summary</h2>
          {(() => {
            const groupedByLocation = shoppingList.reduce((acc, item) => {
              const location = item.location || "N/A";
              if (!acc[location]) {
                acc[location] = {};
              }
              if (!acc[location][item.category]) {
                acc[location][item.category] = [];
              }
              acc[location][item.category].push(item);
              return acc;
            }, {});
            return (
              <>
                {Object.entries(groupedByLocation).map(
                  ([location, categories]) => (
                    <div key={location} className="checkout-location">
                      <h3 className="location-header">{location}</h3>
                      {Object.entries(categories).map(([category, items]) => (
                        <div key={category} className="checkout-category">
                          <h4>{category}</h4>
                          <ul>
                            {items.map((item) => (
                              <li key={item.id} className="checkout-item">
                                <span className="item-info">
                                  {item.name} x {item.quantity}
                                </span>
                                <span className="item-price">
                                  $
                                  {(
                                    item.price *
                                    item.quantity
                                  ).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )
                )}
                <div className="checkout-total">
                  <span>Total:</span>
                  <span className="total-price">
                    $
                    {shoppingList
                      .reduce(
                        (total, item) =>
                          total +
                          item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </>
            );
          })()}
        </section>
      </main>
    </div>
  );
}
