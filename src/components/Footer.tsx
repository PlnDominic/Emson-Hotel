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

  const socialLinks = [
    { icon: FaFacebookF, label: 'Facebook' },
    { icon: FaTwitter, label: 'Twitter' },
    { icon: FaInstagram, label: 'Instagram' },
    { icon: FaYoutube, label: 'YouTube' },
    { icon: FaTripadvisor, label: 'TripAdvisor' },
  ];
  const heading = 'text-[13px] font-semibold tracking-[0.15em] uppercase text-slate-900';

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-slate-900">Emson <span className="text-orange-600">Hotel</span></h3>
            <p className="text-[14px] leading-relaxed">
              Located on the hilltops of Ejisu Ampabame overlooking a spectacular landscape, 
              Emson Hotel offers a unique combination of accommodation, spa and wellness experiences.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className={heading}>Contact</h3>
            <ul className="space-y-3 text-[14px]">
              <li className="flex items-center">
                <MdLocationOn className="mr-2.5 h-5 w-5 text-orange-600 shrink-0" /> Ejisu Ampabame
              </li>
              <li>
                <a href="tel:+233535140377" className="flex items-center hover:text-orange-600 transition-colors">
                  <MdPhone className="mr-2.5 h-5 w-5 text-orange-600 shrink-0" /> +233(0)535140377
                </a>
              </li>
              <li>
                <a href="mailto:info.emsonhotel@gmail.com" className="flex items-center hover:text-orange-600 transition-colors">
                  <MdEmail className="mr-2.5 h-5 w-5 text-orange-600 shrink-0" /> info.emsonhotel@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className={heading}>Newsletter</h3>
            <p className="text-[14px]">Subscribe to our newsletter and stay up-to-date on our news and events.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-white text-slate-900 text-[14px] placeholder:text-slate-400 border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-600 text-white text-[14px] font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section with Copyright and Navigation */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]">
            <p className="text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} Emson Hotel. All Rights Reserved | {' '}
              <a 
                href="https://www.ecstasytechnologies.com" 
                className="text-slate-700 hover:text-orange-600 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Developed by Ecstasy Technologies
              </a>
            </p>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">Home</Link>
              <Link to="/about" className="text-slate-600 hover:text-orange-600 transition-colors">About Us</Link>
              <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors">Contact</Link>
              <Link to="/booking" className="text-slate-600 hover:text-orange-600 transition-colors">Booking</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
