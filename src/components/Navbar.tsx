import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Phone, User, Menu, X } from 'lucide-react';
import logo from '../assets/logo.jpg';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const linkClass = isHomePage 
    ? "text-white hover:text-gray-200" 
    : "text-black hover:text-gray-600";

  const iconClass = isHomePage
    ? "text-white"
    : "text-black";

  return (
    <nav className={`fixed w-full ${isHomePage ? 'bg-transparent' : 'bg-white'} backdrop-blur-sm z-50 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center space-x-3">
            <img 
              src={logo} 
              alt="Emson Hotel Logo" 
              className="h-12 w-12 object-cover logo-spin"
              style={{ borderRadius: '4px' }}
            />
            <h1 className={`text-2xl font-serif ${isHomePage ? 'text-white' : 'text-black'}`}>
              Emson Hotel
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/rooms" className={linkClass}>Rooms</Link>
            <Link to="/facilities" className={linkClass}>Facilities</Link>
            <Link to="/contact" className={linkClass}>Contact</Link>
            <Link to="/about" className={linkClass}>About Us</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/booking" 
              className={`hidden md:flex ${isHomePage ? 'text-white bg-transparent hover:bg-white hover:text-black' : 'text-black bg-transparent hover:bg-black hover:text-white'} transition-all duration-300 px-6 py-2.5 border-2 ${isHomePage ? 'border-white' : 'border-black'} rounded-full font-semibold items-center space-x-2`}
            >
              <Phone size={16} />
              <span>Book Now</span>
            </Link>
            <button className={`p-2 rounded-full hover:bg-gray-100/10`}>
              <User size={20} className={iconClass} />
            </button>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100/10"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={20} className={iconClass} /> : <Menu size={20} className={iconClass} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={closeMobileMenu} className={`${linkClass} block px-3 py-2 rounded-md`}>Home</Link>
              <Link to="/rooms" onClick={closeMobileMenu} className={`${linkClass} block px-3 py-2 rounded-md`}>Rooms</Link>
              <Link to="/facilities" onClick={closeMobileMenu} className={`${linkClass} block px-3 py-2 rounded-md`}>Facilities</Link>
              <Link to="/contact" onClick={closeMobileMenu} className={`${linkClass} block px-3 py-2 rounded-md`}>Contact</Link>
              <Link to="/about" onClick={closeMobileMenu} className={`${linkClass} block px-3 py-2 rounded-md`}>About Us</Link>
              <Link 
                to="/booking" 
                onClick={closeMobileMenu}
                className={`${linkClass} block px-3 py-2 rounded-md`}>
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
