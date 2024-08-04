import React from "react";
import Image from "next/image";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#F96167] to-[#F9D423] text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">About Lift</h1>
          <p className="text-xl">
            Connecting journeys, sharing rides, reducing carbon footprints.
          </p>
        </div>
      </header>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center text-[#F96167]">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center">
            At Lift, we&apos;re on a mission to revolutionize transportation by
            making ride-sharing accessible, affordable, and eco-friendly. We
            believe in the power of community to create a more connected and
            sustainable world.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-12 text-center text-[#F96167]">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Ride Sharing",
                icon: "🚗",
                description: "Find or offer rides with just a few taps.",
              },
              {
                title: "Secure Payments",
                icon: "💳",
                description:
                  "Integrated payment system for hassle-free transactions.",
              },
              {
                title: "Community Ratings",
                icon: "⭐",
                description: "Build trust with our user rating system.",
              },
              {
                title: "Real-time Tracking",
                icon: "🗺️",
                description: "Know exactly where your ride is at all times.",
              },
              {
                title: "Carbon Footprint Reduction",
                icon: "🌿",
                description: "See the positive impact of your shared rides.",
              },
              {
                title: "24/7 Support",
                icon: "🆘",
                description: "Our team is always here to help you.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[#F96167]">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center text-[#F96167]">
            Our Story
          </h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src="/logo.png"
                alt="Lift team"
                width={500}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <p className="text-gray-700 mb-4">
                Lift was born out of a simple idea: to make transportation more
                efficient and environmentally friendly. Our founders, a group of
                tech enthusiasts and environmental advocates, came together in
                2024 with a vision to create a platform that would connect
                people going the same way.
              </p>
              <p className="text-gray-700">
                Since our launch, we&apos;ve helped thousands of people share
                rides, fostered countless new friendships, and significantly
                reduced carbon emissions. We&apos;re proud of how far we&apos;ve
                come, but we&apos;re even more excited about the road ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-16 bg-gradient-to-r from-[#F96167] to-[#F9D423] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Join the Lift Community
          </h2>
          <p className="text-xl mb-8">
            Whether you&apos;re looking to share a ride or offer one, Lift is
            here to connect you. Join us in creating a more connected,
            efficient, and sustainable future.
          </p>
          <button className="bg-white text-[#F96167] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">Lift</h3>
              <p>Connecting journeys, sharing rides.</p>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul>
                <li>
                  <a href="#" className="hover:text-[#F9D423]">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F9D423]">
                    Find a Ride
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F9D423]">
                    Offer a Ride
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F9D423]">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#F9D423]">
                  Facebook
                </a>
                <a href="#" className="hover:text-[#F9D423]">
                  Twitter
                </a>
                <a href="#" className="hover:text-[#F9D423]">
                  Instagram
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/4">
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <form>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-700 text-white px-4 py-2 rounded-l-full w-2/3"
                />
                <button
                  type="submit"
                  className="bg-[#F96167] text-white px-4 py-2 rounded-r-full"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 Lift. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
