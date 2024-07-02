import Image from "next/image";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>RideShare Connect</title>
        <meta
          name="description"
          content="RideShare Connect - Connecting drivers and passengers for shared rides between cities."
        />
      </Head>
      <main className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="bg-blue-500 text-white py-20">
          <div className="container mx-auto text-center">
            <Image
              src="/logo.png"
              alt="RideShare Connect"
              width={150}
              height={150}
            />
            <h1 className="text-4xl font-bold mt-4">
              Welcome to RideShare Connect
            </h1>
            <p className="mt-4 text-lg">
              Connecting drivers and passengers for shared rides between cities.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-xl font-bold mb-4">Find Rides Easily</h3>
                <p className="text-gray-700">
                  Search for available rides between cities with ease.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-xl font-bold mb-4">Create Your Trip</h3>
                <p className="text-gray-700">
                  Drivers can list their trips and passengers can request rides.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-xl font-bold mb-4">Secure Payments</h3>
                <p className="text-gray-700">
                  Make secure payments through our integrated payment gateway.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-200 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <p className="italic text-gray-700">
                  &quot;RideShare Connect made my commute so much easier. Highly
                  recommend!&quot;
                </p>
                <p className="mt-4">- John Doe</p>
              </div>
              {/* Testimonial 2 */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <p className="italic text-gray-700">
                  &quot;I love the flexibility and convenience RideShare Connect
                  provides.&quot;
                </p>
                <p className="mt-4">- Jane Smith</p>
              </div>
              {/* Testimonial 3 */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <p className="italic text-gray-700">
                  &quot;Great platform for finding rides and meeting new
                  people!&quot;
                </p>
                <p className="mt-4">- Michael Johnson</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-500 text-white text-center py-8">
          <div className="container mx-auto">
            <p>&copy; 2024 RideShare Connect. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
