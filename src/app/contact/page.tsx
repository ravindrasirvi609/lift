"use client";
import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#F96167] to-[#F9D423] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">
            We&apos;re here to help. Reach out to us for any queries or support.
          </p>
        </div>
      </header>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#F96167] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+91 81071 99052</p>
            </div>
            <div className="text-center">
              <div className="bg-[#F96167] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">dev@ravindrachoudhary.in</p>
            </div>
            <div className="text-center">
              <div className="bg-[#F96167] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-600">
                Mayank Nagar, Pali, Rajasthan 306401
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center text-[#F96167]">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F96167]"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F96167]"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-gray-700 font-semibold mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F96167]"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-semibold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F96167]"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#F96167] to-[#F9D423] text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center text-[#F96167]">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How do I sign up for Lift?",
                answer:
                  "You can sign up for Lift by downloading our app from the App Store or Google Play Store and following the registration process.",
              },
              {
                question: "Is Lift available in my city?",
                answer:
                  "Lift is currently available in major cities across the United States. Check our 'Cities' page for a full list of locations.",
              },
              {
                question: "How do I report an issue with a ride?",
                answer:
                  "You can report any issues through the app by going to your ride history and selecting the 'Report an Issue' option.",
              },
              {
                question: "How does payment work?",
                answer:
                  "Payments are processed securely through our app. You can add your preferred payment method in the 'Payment' section of your profile.",
              },
            ].map((faq, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-[#F96167]">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
