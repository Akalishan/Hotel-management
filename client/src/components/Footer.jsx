import React from "react";
import { assets } from "../assets/assets";

export const Footer = () => {
  return (
    <div className="bg-[#F6F9FC] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <img
            src={assets.logo}
            alt="logo"
            className="mb-4 h-8 md:h-9 invert opacity-80"
          />
          <p className="text-sm">
            Discover the world's most extraordinary places to stay, from
            boutique hotels to luxury villas and private islands.
          </p>
        </div>

        <div>
          <p className="font-playfair text-lg text-gray-800 mb-3">COMPANY</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="/About" className="hover:text-gray-800 transition-colors">About Us</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-playfair text-lg text-gray-800 mb-3">SUPPORT</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="#" className="hover:text-gray-800 transition-colors">Help Center</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-800 transition-colors">Cancellation Policy</a>
            </li>
          </ul>
        </div>

        <div className="max-w-80">
          <p className="font-playfair text-lg text-gray-800 mb-3">CONTACT US</p>
          <p className="text-sm mb-2">
            Have questions? Reach out to us:
          </p>
          <a 
            href="mailto:support@quickstay.com?subject=Inquiry from QuickStay Website" 
            className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            support@quickstay.com
          </a>
        </div>
      </div>
      
      <hr className="border-gray-300 mt-8" />
      
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-sm">
        <p>© {new Date().getFullYear()} QuickStay. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-800 transition-colors">Sitemap</a>
          </li>
        </ul>
      </div>
    </div>
  );
};