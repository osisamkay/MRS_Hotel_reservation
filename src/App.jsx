import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HotelOverview from './pages/HotelOverview';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/hotel-overview" element={<HotelOverview />} />
        <Route path="/reviews" element={<ComingSoon title="Reviews" />} />
        <Route path="/facilities" element={<ComingSoon title="Hotel Facilities" />} />
        <Route path="/information" element={<ComingSoon title="Hotel Information" />} />
        <Route path="/policies" element={<ComingSoon title="Hotel Policies" />} />
      </Route>
    </Routes>
  );
}

// Simple component for pages that are not yet implemented
const ComingSoon = ({ title }) => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-gray-600">This page is coming soon.</p>
    </div>
  );
};

export default App;
