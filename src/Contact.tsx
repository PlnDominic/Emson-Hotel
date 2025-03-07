import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Phone Card */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:rotate-12">
                <Phone className="w-8 h-8 text-[rgb(0,0,115)]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">Feel free to call us anytime for inquiries and bookings.</p>
              <div className="flex flex-col gap-2">
                <a href="tel:+233(0)248676262" className="text-[rgb(0,0,115)] hover:underline transition-all duration-300 hover:text-blue-700">+233(0)248676262</a>
                <a href="tel:+233(0)551390039" className="text-[rgb(0,0,115)] hover:underline transition-all duration-300 hover:text-blue-700">+233(0)551390039</a>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:rotate-12">
                <Mail className="w-8 h-8 text-[rgb(0,0,115)]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Send us an email for any information about our services.</p>
              <a href="mailto:info@emsonhotel.com" className="text-[rgb(0,0,115)] hover:underline transition-all duration-300 hover:text-blue-700">info@emsonhotel.com</a>
            </motion.div>

            {/* Location Card */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:rotate-12">
                <MapPin className="w-8 h-8 text-[rgb(0,0,115)]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Location</h3>
              <p className="text-gray-600 mb-2">Visit us at our convenient location in Ejisu Ampabame.</p>
              <a href="https://www.google.com/maps?q=6.68700306617911,-1.5233433053500764" target="_blank" rel="noopener noreferrer" className="text-[rgb(0,0,115)] hover:underline transition-all duration-300 hover:text-blue-700">
                View On Google Map
              </a>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl font-serif text-center mb-2 bg-gradient-to-r from-[rgb(0,0,115)] to-blue-600 bg-clip-text text-transparent">Leave us your info</h2>
            <p className="text-gray-600 text-center mb-8">and we will get back to you</p>
            
            <form onSubmit={handleSubmit}>
              <motion.div 
                className="mb-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name*"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)] focus:border-transparent transition-all duration-300"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div 
                className="mb-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)] focus:border-transparent transition-all duration-300"
                  value={formData.email}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div 
                className="mb-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject*"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)] focus:border-transparent transition-all duration-300"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div 
                className="mb-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <textarea
                  name="message"
                  placeholder="Message*"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)] focus:border-transparent transition-all duration-300 resize-none"
                  value={formData.message}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[rgb(0,0,115)] to-blue-600 text-white py-3 rounded-lg transition-all duration-300 hover:shadow-lg font-medium text-lg"
              >
                SUBMIT NOW
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Google Maps Section */}
      <div className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif mb-3 bg-gradient-to-r from-[rgb(0,0,115)] to-blue-600 bg-clip-text text-transparent">
              Find Us Here
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Located in Ejisu Ampabame, our hotel offers easy access to major attractions and landmarks.
              Visit us to experience luxury and comfort firsthand.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative w-full max-w-5xl mx-auto"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-50 rounded-full opacity-50 z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 rounded-full opacity-50 z-0"></div>
            
            {/* Map Container */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 overflow-hidden">
              <div className="aspect-video w-full relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.4876012776387!2d-1.5255319842775928!3d6.687003066179111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDEnMTkuMiJOIDHCsDMxJzI0LjAiVw!5e1!3m2!1sen!2sgh!4v1705590477065!5m2!1sen!2sgh&maptype=satellite"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl shadow-inner"
                ></iframe>

                {/* Overlay gradient */}
                <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]"></div>
              </div>

              {/* Location Details */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-[rgb(0,0,115)]" />
                  <p className="text-sm">
                    Click on the map to get directions to our location
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
