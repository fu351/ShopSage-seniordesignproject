"use client";
import React from "react";
import { useState } from "react";
import { Trash2 } from "lucide-react";

const ip = '3.85.63.15';
const port = 5000;

export default function Home() {
  {/* GROCERY LIST*/}
  const [shoppingList, setShoppingList] = useState([
    //{ id: 1, category: "Dairy", name: "Rice Milk", price: 2.31, quantity: 1, selected: false },
  ]);

  {/* SEARCH RESULTS */}
  const [searchResults, setSearchResults] = useState([
    //{ id: 101, category: "Dairy", name: "Almond Milk", price: 2.99, location: "Walmart", distance: "2.1 mi" },
  ]);

  {/* STATE - SEARCH QUERY*/}
  const [searchQuery, setSearchQuery] = useState("");

  {/* STATE - SIDEBAR */}
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  {/* Quantity Change Box */}
  const handleQuantityChange = (id, newQuantity) => {
    setShoppingList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  {/* Selection Check Box*/}
  const toggleSelection = (id) => {
    setShoppingList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Last search query
  const [lastSearch, setLastSearch] = useState("");
  
  const handleViewSimilar = (item) => {
    setSearchQuery(item.search);
    handleSearchDirect(item.search);
  };
  
  // Function to trigger search without needing an Enter key event
  const handleSearchDirect = async (query) => {
    setLastSearch(searchQuery)

    if (query.trim() !== "") {
      try {
        const response = await fetch(
          `/api/kroger?zipCode=47906&searchTerm=${encodeURIComponent(query)}`
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
  
        const data = await response.json();
        setSearchResults(data); // Update search results with data from Kroger API
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };
  
  // Modify handleSearch to use handleSearchDirect
  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      handleSearchDirect(searchQuery);
    }
  };
  
  {/* Add Item to Shopping List Button */}
  const addToShoppingList = (item) => {
    setShoppingList(prevList => {
      // Check if the item already exists in the shopping list
      const itemExists = prevList.some(existingItem => existingItem.id === item.items?.[0]?.itemId);
      
      if (!itemExists) {
        return [...prevList, { ...item, id: item.items?.[0]?.itemId, category: item.categories?.[0], name: item.items?.[0]?.name, price: item.items?.[0]?.price?.regular?.toFixed(2), quantity: 1, selected: false, location: item.location, search: lastSearch }];
      }
      
      return prevList; // Return the same list if item already exists
    });
  };

  {/* Remove Item to Shopping List Button */}
  const removeFromShoppingList = (id) => {
    setShoppingList(prevList => prevList.filter(item => item.id !== id));
  };

  {/* View Search Bar */}
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  {/* Page Elements */}
  return (
    <div className="page-container">
      {/* Title Header */}
      <div className="title-bar">
        ShopSage
      </div>

      {/* Search Sidebar */}
      {isSidebarVisible && (
        <div className="sidebar">
          {/* Input textbox */}
          <input
            type="text"
            className="search-bar"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch} // Triggers API request on Enter
          />
          {/* Results display */}
          <div className="search-results">
            <div className="search-header">Search Results</div>
            {searchResults.map((item) => {
              // Check if item is already in the shopping list
              const itemExists = shoppingList.some(existingItem => existingItem.id === item.items?.[0]?.itemId);

              return (
                <div key={item.items?.[0]?.itemId} className="search-item">
                  <div className="search-image">
                    {item.images
                      ?.find(img => img.perspective === "front")
                      ?.sizes.find(size => size.size === "thumbnail")
                      ?.url && (
                        <img
                          className="search-image"
                          src={item.images.find(img => img.perspective === "front").sizes.find(size => size.size === "thumbnail").url}
                          alt="Product Thumbnail"
                        />
                      )}
                  </div>
                  <div className="search-details">
                    <span className="search-name">
                      {item.description}
                    </span>
                    <span className="search-price">
                      ${item.items?.[0]?.price?.regular?.toFixed(2) ?? "N/A"}
                    </span>
                    <span className="search-location">
                      {item.location}
                    </span>
                  </div>
                  {/* Change button style and disable functionality if item exists */}
                  <button
                    className={`add-button ${itemExists ? "disabled" : ""}`}
                    onClick={!itemExists ? () => addToShoppingList(item) : undefined}
                    disabled={itemExists}
                  >
                    {itemExists ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shopping List */}
      <div className="shopping-list">
      {(() => {
        const groupedItems = shoppingList.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});

        return Object.entries(groupedItems).flatMap(([category, items]) => [
          <div key={`category-${category}`} className="category-row">
            {category}
          </div>,
          ...items.map((item) => (
            <div key={item.items?.[0]?.itemId} className="shopping-item">
              <div className="image-placeholder">
                {item.images
                ?.find(img => img.perspective === "front")
                ?.sizes.find(size => size.size === "thumbnail")
                ?.url && (
                  <img
                    className="search-image"
                    src={item.images.find(img => img.perspective === "front").sizes.find(size => size.size === "thumbnail").url}
                    alt="Product Thumbnail"
                  />
                )}
              </div>
              <div className="item-details">
                <span className="item-name">
                  {item.description}
                </span>
                <div className="price-quantity">
                  <span className="price">${item.items?.[0]?.price?.regular?.toFixed(2)}</span>
                  <label>
                    qty
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                      }
                      style={{ marginLeft: "6px" }}
                    />
                  </label>
                </div>
                <div className="item-location">
                  {item.location || "N/A"}
                </div>
              </div>
              <div className="actions">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelection(item.id)}
                />
                <button className="view-similar" onClick={() => handleViewSimilar(item)}>
                  Compare
                </button>
                <button className="remove-button" onClick={() => removeFromShoppingList(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )),
        ]);
      })()}
      </div>

      {/* Checkout Summary */}
      <div className="checkout-summary">
        <h3>Checkout Summary</h3>
        {(() => {
          const selectedItems = shoppingList.filter(item => item.selected);

          if (selectedItems.length === 0) {
            return <p>No items selected.</p>;
          }

          // First, group items by location
          const groupedByLocation = selectedItems.reduce((acc, item) => {
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
              {Object.entries(groupedByLocation).map(([location, categories]) => (
                <div key={location} className="checkout-location">
                  <h3 className="location-header">{location}</h3>
                  {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="checkout-category">
                      <h4>{category}</h4>
                      <ul>
                        {items.map(item => (
                          <li key={item.id} className="checkout-item">
                            <span className="item-info">
                              {item.description} x {item.quantity}
                            </span>
                            <span className="item-price">
                              ${item.items?.[0]?.price?.regular?.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
              <div className="checkout-total">
                <span>Total:</span>
                <span className="total-price">
                  ${selectedItems
                    .reduce((total, item) => total + item.items?.[0]?.price?.regular * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
            </>
          );
        })()}
      </div>


      {/* Bottom Buttons */}
      <div className="button-container">
        <button className="button">
          Generate Shopping List
        </button>
        <button className="button" onClick = {toggleSidebar}>
          Search Items
        </button>
      </div>
    </div>
  );
}