"use client";
import React from "react";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function Home() {
  {/* SAMPLE DATA - GROCERY LIST*/}
  const [shoppingList, setShoppingList] = useState([
    { id: 1, category: "Dairy", name: "Rice Milk", price: 2.31, quantity: 1, selected: false },
    { id: 2, category: "Dairy", name: "Cheddar Cheese", price: 3.99, quantity: 1, selected: false },
    { id: 3, category: "Dairy", name: "Greek Yogurt", price: 4.50, quantity: 1, selected: false },
    { id: 4, category: "Beverages", name: "Black Tea", price: 5.58, quantity: 1, selected: false },
    { id: 5, category: "Beverages", name: "Spring Water", price: 10.63, quantity: 1, selected: false },
    { id: 6, category: "Beverages", name: "Orange Juice", price: 6.99, quantity: 1, selected: false },
    { id: 7, category: "Frozen", name: "Frozen Blueberries", price: 4.99, quantity: 1, selected: false },
    { id: 8, category: "Frozen", name: "Frozen Peas", price: 2.15, quantity: 1, selected: false },
    { id: 9, category: "Frozen", name: "Frozen Pizza", price: 8.49, quantity: 1, selected: false },
    { id: 10, category: "Frozen", name: "Frozen Chicken Nuggets", price: 7.99, quantity: 1, selected: false },
    { id: 11, category: "Produce", name: "Avocados", price: 3.48, quantity: 1, selected: false },
    { id: 12, category: "Produce", name: "Bananas", price: 1.99, quantity: 1, selected: false },
    { id: 13, category: "Produce", name: "Carrots", price: 2.79, quantity: 1, selected: false },
    { id: 14, category: "Produce", name: "Bell Peppers", price: 4.29, quantity: 1, selected: false },
    { id: 15, category: "Bakery", name: "Whole Wheat Bread", price: 3.99, quantity: 1, selected: false },
    { id: 16, category: "Bakery", name: "Bagels", price: 4.99, quantity: 1, selected: false },
  ]);

  {/* SAMPLE DATA - SEARCH RESULTS*/}
  const [searchResults, setSearchResults] = useState([
    { id: 101, category: "Dairy", name: "Almond Milk", price: 2.99, location: "Walmart", distance: "2.1 mi" },
    { id: 102, category: "Dairy", name: "Oat Milk", price: 3.49, location: "Target", distance: "1.8 mi" },
    { id: 103, category: "Dairy", name: "Soy Milk", price: 2.89, location: "Whole Foods", distance: "3.0 mi" },
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

  {/* View Similar Button */}
  const handleViewSimilar = (name) => {
    alert(`Viewing similar items for ${name}`);
  };

  
  {/* Type in Search Query */}
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Simulated search filter (you can replace this with an API call)
    setSearchResults(prevResults => 
      prevResults.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    );
  };
  
  {/* Add Item to Shopping List Button */}
  const addToShoppingList = (item) => {
    setShoppingList(prevList => {
      // Check if the item already exists in the shopping list
      const itemExists = prevList.some(existingItem => existingItem.id === item.id);
      
      if (!itemExists) {
        return [...prevList, { ...item, quantity: 1, selected: false }];
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
            onChange={handleSearch}
          />
          {/* Results display */}
          <div className="search-results">
            <div className="search-header">Search Results</div>
            {searchResults.map((item) => {
              // Check if item is already in the shopping list
              const itemExists = shoppingList.some(existingItem => existingItem.id === item.id);

              return (
                <div key={item.id} className="search-item">
                  <div className="image-placeholder"></div>
                  <div className="search-details">
                    <span className="search-name">{item.name}</span>
                    <span className="search-price">${item.price.toFixed(2)}</span>
                    <span className="search-location">{item.location} - {item.distance}</span>
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
            <div key={item.id} className="shopping-item">
              <div className="image-placeholder"></div>
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <div className="price-quantity">
                  <span className="price">${item.price.toFixed(2)}</span>
                  <label>
                    qty
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="actions">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelection(item.id)}
                />
                <button className="view-similar" onClick={() => handleViewSimilar(item.name)}>
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