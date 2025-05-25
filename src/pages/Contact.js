import React from "react";

export default function Contact() {
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
      <img src="/logo.jpeg" alt="Company Logo" className="h-16 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Contact Us</h2>
      <p className="text-gray-600 mb-1">
        Phone: <a href="tel:0745389833" className="text-blue-600 underline">0745389833</a>
      </p>
      <p className="text-gray-600 mb-1">
        Email: <a href="vedester@gmail.com" className="text-blue-600 underline">info@yourcompany.com</a>
      </p>
      <a
        href="https://wa.me/254745389833"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.23-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.02 2.81 1.16 3 .14.19 2.01 3.07 4.87 4.19.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
        </svg>
        WhatsApp
      </a>
    </div>
  );
}