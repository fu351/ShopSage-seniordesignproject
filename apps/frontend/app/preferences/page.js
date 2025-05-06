"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import config from "../../config";

export default function PreferencesPage() {
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableAllergens = [
    "Peanuts",
    "Tree Nuts",
    "Dairy",
    "Eggs",
    "Shellfish",
    "Wheat",
    "Soy",
    "Fish",
  ];

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to view your preferences.");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/getPreferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch preferences");
      }

      const data = await response.json();
      setSelectedAllergens(data.allergens || []);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      alert("Could not fetch preferences.");
    }
  };

  const savePreferences = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to save your preferences.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/savePreferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergens: selectedAllergens }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Could not save preferences.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAllergen = (allergen) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((item) => item !== allergen)
        : [...prev, allergen]
    );
  };

  return (
    <div className="preferences-container">
      <header className="header">
        <Link href="..">
          <img src="/logo.png" alt="ShopSage Logo" className="logo-centered" />
        </Link>
      </header>
      <main className="main-content">
        <section className="preferences-section">
          <h1 className="preferences-header">Allergen Preferences</h1>
          <p className="preferences-description">
            Select the allergens you want to avoid:
          </p>
          <div className="allergen-list">
            {availableAllergens.map((allergen) => (
              <label key={allergen} className="allergen-item">
                <input
                  type="checkbox"
                  checked={selectedAllergens.includes(allergen)}
                  onChange={() => toggleAllergen(allergen)}
                />
                {allergen}
              </label>
            ))}
          </div>
          <button
            onClick={savePreferences}
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Preferences"}
          </button>
        </section>
      </main>
    </div>
  );
}