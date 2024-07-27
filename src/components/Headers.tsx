"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

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

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#F9D423] shadow-md" : "bg-[#F9D423]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-[#F96167] text-2xl font-bold">
              LIFT
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "text-[#F96167] font-bold"
                  : "text-[#F96167] hover:text-[#F96167]/80"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${
                pathname === "/about"
                  ? "text-[#F96167] font-bold"
                  : "text-[#F96167] hover:text-[#F96167]/80"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`${
                pathname === "/contact"
                  ? "text-[#F96167] font-bold"
                  : "text-[#F96167] hover:text-[#F96167]/80"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* User info, profile, and logout for desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-[#F96167]">Welcome, {user.email}</span>
                <Link
                  href="/profile"
                  className="text-[#F96167] hover:text-[#F96167]/80"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-[#F96167] text-white px-4 py-2 rounded hover:bg-[#F96167]/80 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[#F96167] hover:text-[#F96167]/80"
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
            <button onClick={toggleMenu} className="text-[#F96167]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block text-[#F96167] hover:bg-[#F96167] hover:text-white px-3 py-2 rounded-md"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block text-[#F96167] hover:bg-[#F96167] hover:text-white px-3 py-2 rounded-md"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-[#F96167] hover:bg-[#F96167] hover:text-white px-3 py-2 rounded-md"
              >
                Contact
              </Link>
            </div>
            {user ? (
              <div className="pt-4 pb-3 border-t border-[#F96167]">
                <div className="flex items-center px-5">
                  <div className="text-[#F96167]">
                    <span>Welcome, {user.email}</span>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#F96167] hover:text-white hover:bg-[#F96167] transition duration-300"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#F96167] hover:text-white hover:bg-[#F96167] transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-[#F96167]">
                <div className="px-2 space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#F96167] hover:text-white hover:bg-[#F96167] transition duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#F96167] hover:text-white hover:bg-[#F96167] transition duration-300"
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
