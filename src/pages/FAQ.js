import React from "react";

const FAQ = () => (
  <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-xl p-8">
    <h2 className="text-2xl font-bold text-blue-800 mb-4">Frequently Asked Questions</h2>
    <ul className="text-left text-gray-700 list-disc list-inside space-y-2">
      <li>
        <strong>How do I request a quote?</strong>
        <br />
        Use our online calculator and fill in your project details. You’ll receive instant pricing!
      </li>
      <li>
        <strong>What types of glass do you offer?</strong>
        <br />
        We offer clear, frosted, extra clear, and more. See our calculator for the full list.
      </li>
      <li>
        <strong>How does installation work?</strong>
        <br />
        Our team will contact you to schedule a site visit and professional installation.
      </li>
      <li>
        <strong>How do I contact support?</strong>
        <br />
        Use the <a href="/contact" className="text-blue-600 underline">Contact Us</a> page or the WhatsApp/email icons on the site.
      </li>
    </ul>
  </div>
);

export default FAQ;