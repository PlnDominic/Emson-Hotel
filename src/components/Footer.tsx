import React, { FormEvent } from 'react';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTripadvisor } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Footer() {
  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    if (emailInput) {
      console.log(`Email submitted: ${emailInput.value}`);
    }
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">EMSON HOTEL</h3>
            <p className="text-gray-300">
              Located on the hilltops of Ejisu Ampabame overlooking a spectacular landscape, 
              Emson Hotel offers a unique combination of accommodation, spa and wellness experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="YouTube">
                <FaYoutube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="TripAdvisor">
                <FaTripadvisor className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">CONTACT</h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-300">
                <MdLocationOn className="mr-2" /> Ejisu Ampabame
              </p>
              <div className="space-y-2">
                <p className="flex items-center text-gray-300">
                  <MdPhone className="mr-2" /> +233(0)248676262
                </p>
                <p className="flex items-center text-gray-300">
                  <MdPhone className="mr-2" /> +233(0)551390039
                </p>
              </div>
              <p className="flex items-center text-gray-300">
                <MdEmail className="mr-2" /> info.emsonhotel@gmail.com
              </p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">NEWSLETTER</h3>
            <p className="text-gray-300">Subscribe to our newsletter and stay up-to-date on our news and events.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gray-500"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section with Copyright and Navigation */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              {new Date().getFullYear()} Emson Hotel. All Rights Reserved | {' '}
              <a 
                href="https://wa.me/233542855399" 
                className="hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Designed by Ecstacy Geospatial Services
              </a>
            </p>
            <nav className="flex space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              <Link to="/booking" className="text-gray-300 hover:text-white transition-colors">Booking</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
