// app/privacy/page.tsx
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#F96167] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            1. Information We Collect
          </h2>
          <p className="mb-6">
            We collect personal information such as your name, email, phone
            number, location data, and payment information to provide our car
            pooling service.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            2. How We Use Your Information
          </h2>
          <p className="mb-6">
            We use your information to match riders and drivers, process
            payments, improve our service, and ensure safety. We may use your
            location data to suggest rides or track ongoing trips.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            3. Information Sharing
          </h2>
          <p className="mb-6">
            We share necessary information between riders and drivers to
            facilitate rides. We may share data with law enforcement if required
            by law.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            4. Data Security
          </h2>
          <p className="mb-6">
            We use industry-standard security measures to protect your data.
            However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            5. Your Choices
          </h2>
          <p className="mb-6">
            You can access, update, or delete your account information at any
            time. You can also opt out of promotional communications.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            6. Changes to This Policy
          </h2>
          <p className="mb-6">
            We may update this policy periodically. We&apos;ll notify you of
            significant changes via email or through our app.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
