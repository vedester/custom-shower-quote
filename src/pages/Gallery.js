import React from "react";

const Gallery = () => (
  <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-xl p-8 text-center">
    <h2 className="text-2xl font-bold text-blue-800 mb-4">Gallery</h2>
    <div className="flex justify-center gap-8 flex-wrap">
      <img src="/images/models/MTI-101.jpeg" alt="MTI-101" className="w-60 h-60 object-cover rounded shadow mb-4" />
      <img src="/images/models/MTI-102.jpg" alt="MTI-102" className="w-60 h-60 object-cover rounded shadow mb-4" />
      {/* Add more images as needed */}
    </div>
    <p className="mt-6 text-gray-600">Explore our range of custom installations. More photos coming soon!</p>
  </div>
);

export default Gallery;