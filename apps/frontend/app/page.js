"use client"; // This makes the component interactive

export default function Home() {
  const handleGenerateList = () => {
    console.log("Generating shopping list...");
    // Add logic here for generating the shopping list
  };

  return (
    <div className="page-container">
      <div
        className="title"
        style={{fontFamily: "var(--font-geist-sans)"}}
      >
        ShopSage
      </div>
      
      <div className="button-container">
        <button
          onClick={handleGenerateList}
          className="button"
          style={{fontFamily: "var(--font-geist-sans)"}}
        >
          Generate Shopping List
        </button>
        
        <button
          onClick={handleGenerateList}
          className="button"
          style={{fontFamily: "var(--font-geist-sans)"}}
        >
          Manually Create Shopping List
        </button>
      </div>
    </div>
  );
}

