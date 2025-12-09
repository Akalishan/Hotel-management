import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

import { CgProfile } from "react-icons/cg";
import { FiBook, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/Experience" },
    { name: "About", path: "/About" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const location = useLocation();

  const { user, navigate, isOwner, setShowHotelReg, setIsLogin, logout } =
    useAppContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target)) {
          setIsProfileOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    setIsScrolled((prev) => (location.pathname !== "/" ? true : prev));
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const profileMenuItems = [
    {
      label: "My Profile",
      icon: CgProfile,
      onClick: () => {
        navigate("/profile");
        setIsProfileOpen(false);
      },
    },
    {
      label: "My Bookings",
      icon: FiBook,
      onClick: () => {
        navigate("/my-bookings");
        setIsProfileOpen(false);
      },
    },
    {
      label: "Logout",
      icon: FiLogOut,
      onClick: () => {
        logout();
        setIsProfileOpen(false);
      },
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}

        {user && (
          <button
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
              isScrolled ? "text-black" : "text-white"
            } transition-all`}
            onClick={() =>
              isOwner ? navigate("/owner") : setShowHotelReg(true)
            }
          >
            {isOwner ? `Dashboard` : `List Your Hotel`}
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full ml-4 transition-all duration-500 ${
                isScrolled
                  ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isScrolled ? "bg-gray-300" : "bg-white/30"
                }`}
              >
                <CgProfile className="w-5 h-5" />
              </div>
              <span className="hidden lg:block">{user.username}</span>
              <FaChevronDown className="w-4 h-4" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                  {isOwner && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Hotel Owner
                    </span>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {profileMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                        item.className || ""
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsLogin(true)}
            className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${
              isScrolled ? "text-white bg-black" : "bg-white text-black"
            }`}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <div className="relative" ref={mobileProfileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isScrolled
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white/20 text-white"
              }`}
            >
              <CgProfile className="w-5 h-5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                  {isOwner && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Hotel Owner
                    </span>
                  )}
                </div>

                <div className="py-1">
                  {profileMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                        item.className || ""
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isMenuOpen ? (
          <FiX
            onClick={() => setIsMenuOpen(false)}
            className={`${isScrolled && "invert"} h-6 w-6 cursor-pointer`}
          />
        ) : (
          <FiMenu
            onClick={() => setIsMenuOpen(true)}
            className={`${isScrolled && "invert"} h-6 w-6 cursor-pointer`}
          />
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <FiX className="h-6 w-6" />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {user && (
          <>
            <button
              className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
              onClick={() => {
                isOwner ? navigate("/owner") : setShowHotelReg(true);
                setIsMenuOpen(false);
              }}
            >
              {isOwner ? `Dashboard` : `List Your Hotel`}
            </button>

            <button
              onClick={() => {
                navigate("/my-bookings");
                setIsMenuOpen(false);
              }}
              className="text-gray-700"
            >
              My Bookings
            </button>

            <button
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              className="text-gray-700"
            >
              Profile
            </button>

            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="text-red-600"
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <button
            onClick={() => setIsLogin(true)}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
