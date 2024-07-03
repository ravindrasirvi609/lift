import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="space-y-4">
          <p>
            <strong>1. Search a Ride:</strong> Enter your trip details to find
            available rides.
          </p>
          <p>
            <strong>2. Choose a Ride:</strong> Select the ride that best fits
            your schedule and preferences.
          </p>
          <p>
            <strong>3. Book and Go:</strong> Sign up and book your ride, then
            get ready to travel!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
