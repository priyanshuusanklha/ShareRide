import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">About</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Contact</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 ShareRide, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
