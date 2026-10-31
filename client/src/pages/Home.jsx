import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="People in a car"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Share Your Ride, Share the Cost
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            Join thousands of people saving money and reducing their carbon footprint by sharing rides. Safe, affordable, and eco-friendly.
          </p>
          <div className="mt-10 max-w-sm sm:max-w-none sm:flex sm:justify-start">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link to="/rides" className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8">
                Find a Ride
              </Link>
              <Link to="/offer-ride" className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8">
                Offer a Ride
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How it works</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Simple and Easy</p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  1
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Search</h3>
                <p className="mt-2 text-base text-gray-500">Find rides going your way by entering your origin and destination.</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  2
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Book</h3>
                <p className="mt-2 text-base text-gray-500">Request a seat and pay securely once the driver accepts.</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  3
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Ride</h3>
                <p className="mt-2 text-base text-gray-500">Meet your driver and enjoy the shared journey together.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">Safe and Secure</h3>
              <p className="mt-4 text-lg text-gray-500">We verify all users and provide a secure platform for payments. Read reviews before booking.</p>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">Affordable Travel</h3>
              <p className="mt-4 text-lg text-gray-500">Save up to 50% on your travel costs compared to traditional transport methods.</p>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">Eco-Friendly</h3>
              <p className="mt-4 text-lg text-gray-500">Reduce your carbon footprint by filling empty seats and keeping cars off the road.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
