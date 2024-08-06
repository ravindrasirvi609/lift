"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Notifications from "./Notifications";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const NavLink: React.FC<{
    href: string;
    icon: React.ReactNode;
    text: string;
  }> = ({ href, icon, text }) => (
    <Link
      href={href}
      className={`flex items-center space-x-2 ${
        pathname === href
          ? "text-[#F96167] font-bold"
          : "text-gray-700 hover:text-[#F96167]"
      } transition duration-300`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-[#F9D423]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-[#F96167] text-2xl font-bold flex items-center"
            >
              <FaHome className="mr-2" />
              LIFT
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-6">
            <NavLink href="/" icon={<FaHome />} text="Home" />
            <NavLink href="/about" icon={<FaInfoCircle />} text="About" />
            <NavLink href="/contact" icon={<FaEnvelope />} text="Contact" />
          </nav>

          {/* User info, profile, notifications, and logout for desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Notifications />
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-[#F96167] transition duration-300">
                    <FaUser />
                    <span>{user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-[#F96167] transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#F96167] text-white px-4 py-2 rounded hover:bg-[#F96167]/80 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#F96167] transition duration-300"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-b-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink href="/" icon={<FaHome />} text="Home" />
              <NavLink href="/about" icon={<FaInfoCircle />} text="About" />
              <NavLink href="/contact" icon={<FaEnvelope />} text="Contact" />
            </div>
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <FaUser className="h-6 w-6 text-gray-700" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.email}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Notifications />
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#F96167] hover:bg-gray-100 transition duration-300"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#F96167] hover:bg-gray-100 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-2 space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#F96167] hover:bg-gray-100 transition duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#F96167] hover:bg-[#F96167]/80 transition duration-300"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
