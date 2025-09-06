// src/components/Navbar.jsx
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-bold text-indigo-600">
            रामस्मरण
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </a>
            <a href="/leaderboard" className="text-gray-700 hover:text-indigo-600">
              Leaderboard
            </a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600">
              About
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="px-4 py-3 space-y-2">
            <a
              href="/"
              className="block text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="/leaderboard"
              className="block text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </a>
            <a
              href="/about"
              className="block text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
