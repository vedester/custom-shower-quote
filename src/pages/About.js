import React from "react";

const About = () => (
  <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-xl p-8 text-center">
    <h2 className="text-2xl font-bold text-blue-800 mb-4">About Us</h2>
    <p className="text-lg text-gray-700 mb-4">
      We are passionate about providing high-quality, custom glass shower solutions for your home or business. With years of experience and a commitment to excellence, our team ensures every project is tailored to your needs.
    </p>
    <p className="text-gray-600">
      Have questions? Visit our <a href="/faq" className="text-blue-600 underline">FAQ</a> page or <a href="/contact" className="text-blue-600 underline">Contact Us</a>.
    </p>
  </div>
);

export default About;