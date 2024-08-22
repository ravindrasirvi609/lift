// app/cookies/page.tsx
import React from "react";

const CookiesPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#F96167] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Cookies Policy</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            1. What Are Cookies
          </h2>
          <p className="mb-6">
            Cookies are small text files stored on your device when you use our
            LIFT. They help us provide a better user experience and understand
            how you interact with our service.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            2. How We Use Cookies
          </h2>
          <p className="mb-6">
            We use cookies to remember your preferences, keep you logged in,
            analyze app usage, and personalize your experience. They also help
            us match riders and drivers efficiently.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            3. Types of Cookies We Use
          </h2>
          <ul className="list-disc list-inside mb-6 pl-4">
            <li className="mb-2">
              Essential cookies: Required for basic app functionality
            </li>
            <li className="mb-2">
              Analytical cookies: Help us improve our service
            </li>
            <li className="mb-2">
              Functional cookies: Remember your preferences
            </li>
            <li className="mb-2">
              Targeting cookies: Deliver personalized content
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            4. Third-Party Cookies
          </h2>
          <p className="mb-6">
            We may use third-party services that use cookies, such as Google
            Analytics or payment processors. These parties may access the data
            collected by cookies.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            5. Managing Cookies
          </h2>
          <p className="mb-6">
            You can control cookies through your browser settings or device
            preferences. However, disabling cookies may affect the functionality
            of our car pooling service.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-[#F96167]">
            6. Updates to This Policy
          </h2>
          <p className="mb-6">
            We may update this Cookies Policy as we introduce new features or
            change our practices. Check back periodically for updates.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CookiesPolicy;
