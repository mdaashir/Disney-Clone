import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white p-4"
      data-testid="header"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/Disney.ico"
            alt="Disney+"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-8"
          data-testid="desktop-navigation"
        >
          <button className="hover:text-blue-400" data-testid="nav-home">
            HOME
          </button>
          <button className="hover:text-blue-400" data-testid="nav-search">
            SEARCH
          </button>
          <button className="hover:text-blue-400" data-testid="nav-watchlist">
            WATCHLIST
          </button>
          <button className="hover:text-blue-400" data-testid="nav-originals">
            ORIGINALS
          </button>
          <button className="hover:text-blue-400" data-testid="nav-movies">
            MOVIES
          </button>
          <button className="hover:text-blue-400" data-testid="nav-series">
            SERIES
          </button>
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden sm:flex items-center space-x-4">
          <button className="px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-black transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="mobile-menu-button"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2" data-testid="mobile-menu">
          <button
            className="block w-full text-left p-2 hover:bg-gray-800"
            data-testid="mobile-nav-home"
          >
            HOME
          </button>
          <button
            className="block w-full text-left p-2 hover:bg-gray-800"
            data-testid="mobile-nav-search"
          >
            SEARCH
          </button>
          <button
            className="block w-full text-left p-2 hover:bg-gray-800"
            data-testid="mobile-nav-watchlist"
          >
            WATCHLIST
          </button>
          <button
            className="block w-full text-left p-2 hover:bg-gray-800"
            data-testid="mobile-nav-originals"
          >
            ORIGINALS
          </button>
          <button
            className="block w-full text-left p-2 hover:bg-gray-800"
            data-testid="mobile-nav-movies"
          >
            MOVIES
          </button>
          <button
            className="block w-full text-left p-2 hover:bg-gray-800"
            data-testid="mobile-nav-series"
          >
            SERIES
          </button>

          {/* Mobile Auth Buttons */}
          <div className="flex space-x-2 p-2">
            <button className="flex-1 px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-black transition-colors">
              Sign In
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
