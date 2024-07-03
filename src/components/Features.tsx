import React from "react";

const Features: React.FC = () => {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <ul className="space-y-4">
          <li>Real-time tracking</li>
          <li>User reviews</li>
          <li>24/7 support</li>
        </ul>
      </div>
    </section>
  );
};

export default Features;
