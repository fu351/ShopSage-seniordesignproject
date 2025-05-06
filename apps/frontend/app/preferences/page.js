"use client";
import React, { useState, useEffect, useContext } from "react";
import config from "../../config";
import { AuthContext } from "../AuthContext"; // Adjust if needed

export default function PreferencesPage() {
  const { user } = useContext(AuthContext); // Use shared auth context
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
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Still needed unless token is stored in context
      const response = await fetch(`${config.apiBaseUrl}/getPreferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch preferences");

      const data = await response.json();
      setSelectedAllergens(data.allergens || []);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      alert("Could not fetch preferences.");
    }
  };

  const savePreferences = async () => {
    try {
      const token = localStorage.getItem("authToken");
      setIsLoading(true);

      const response = await fetch(`${config.apiBaseUrl}/savePreferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergens: selectedAllergens }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

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

  if (!user) {
    return (
      <div className="preferences-container">
        <h1>Allergen Preferences</h1>
        <p>You must be signed in to view and save preferences.</p>
      </div>
    );
  }

  return (
    <div className="preferences-container">
      <h1>Allergen Preferences</h1>
      <p>Select the allergens you want to avoid:</p>
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
    </div>
  );
}
