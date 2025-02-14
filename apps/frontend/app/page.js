"use client";

import { useState } from "react";

export default function Home() {
  {/* SAMPLE DATA */}
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

  {/* Quantity Change Box */}
  const handleQuantityChange = (id, newQuantity) => {
    setShoppingList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  {/* Selection */}
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

  return (
    <div className="page-container">
      {/* Title Header */}
      <div className="title-bar" style={{ fontFamily: "var(--font-geist-sans)" }}>
        ShopSage
      </div>

      {/* Shopping List */}
      <div className="shopping-list">
        {shoppingList.reduce((acc, item, index, array) => {
          // Insert category row if it's the first item of a category
          if (index === 0 || array[index - 1].category !== item.category) {
            acc.push(
              <div key={item.category} className="category-row">
                {item.category}
              </div>
            );
          }

          // Add shopping item
          acc.push(
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
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelection(item.id)}
                />
                {/* View Similar Button */}
                <button
                  className="view-similar"
                  onClick={() => handleViewSimilar(item.name)}
                >
                  Compare
                </button>
              </div>
            </div>
          );

          return acc;
        }, [])}
      </div>

      {/* Buttons */}
      <div className="button-container">
        <button className="button">
          Generate Shopping List
        </button>
        <button className="button">
          Manually Add Item
        </button>
      </div>
    </div>
  );
}