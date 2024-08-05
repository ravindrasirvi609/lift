import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#F96167] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            1. Acceptance of Terms
          </h2>
          <p className="mb-6">
            By using our car pooling service, you agree to these Terms of
            Service. If you don&apos;t agree, please don&apos;t use our
            platform.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            2. User Accounts
          </h2>
          <p className="mb-6">
            You must create an account to use our service. Keep your account
            information confidential and up-to-date. You&apos;re responsible for
            all activities under your account.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            3. Rides and Payments
          </h2>
          <p className="mb-6">
            Drivers set their own prices. We facilitate payments between riders
            and drivers. We charge a service fee for each completed ride.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            4. User Conduct
          </h2>
          <p className="mb-6">
            Be respectful to other users. Don&apos;t engage in harmful,
            fraudulent, or illegal activities. We reserve the right to suspend
            or terminate accounts for misconduct.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            5. Liability
          </h2>
          <p className="mb-6">
            We&apos;re not responsible for the actions of users or the condition
            of vehicles. Use our service at your own risk.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            6. Changes to Service
          </h2>
          <p className="mb-6">
            We may modify or discontinue our service at any time. We&apos;ll
            notify you of significant changes.
          </p>
        </div>
      </main>
      <footer className="bg-[#F9D423] text-gray-800 py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 LIFT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
