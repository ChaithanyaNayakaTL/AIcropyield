import Hero from "@/components/Hero";
import FarmerDashboard from "@/components/FarmerDashboard";
import { useState } from "react";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <FarmerDashboard />;
  }

  return (
    <div>
      <Hero />
      {/* Quick access to dashboard for demo */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setShowDashboard(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
          aria-label="Open Farmer Dashboard"
        >
          Open Dashboard
        </button>
      </div>
    </div>
  );
};

export default Index;
