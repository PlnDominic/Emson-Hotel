import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

  const card = 'bg-white rounded-2xl border border-slate-200 shadow-sm';
  const label = 'block text-[13px] font-medium text-slate-600 mb-1.5';
  const field = 'w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition';
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  const contactItems = [
    {
      icon: Phone,
      title: 'Phone',
      text: 'Call us anytime for inquiries and bookings.',
      link: { href: 'tel:+233535140377', label: '+233(0)535140377' },
    },
    {
      icon: Mail,
      title: 'Email',
      text: 'Send us an email for any information about our services.',
      link: { href: 'mailto:info.emsonhotel@gmail.com', label: 'info.emsonhotel@gmail.com' },
    },
    {
      icon: MapPin,
      title: 'Location',
      text: 'Ejisu Ampabame, Ashanti Region, Ghana.',
      link: { href: 'https://www.google.com/maps?q=6.68700306617911,-1.5233433053500764', label: 'View on Google Maps', external: true },
    },
  ];

  return (
    <>
      <Navbar />
      <section className="w-full bg-slate-50 pt-28 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page header */}
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="text-[12px] tracking-[0.2em] uppercase text-orange-600 font-semibold">Get in Touch</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-slate-900">Contact Us</h1>
            <p className="mt-3 text-slate-600 text-[15px] leading-relaxed">
              Questions about a booking, our rooms or your stay? Reach out and the Emson Hotel team will be happy to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
            {/* Contact details */}
            <motion.div {...fadeUp(0.1)} className="lg:col-span-2 space-y-4">
              {contactItems.map(({ icon: Icon, title, text, link }) => (
                <div key={title} className={`${card} p-5 flex gap-4`}>
                  <div className="w-11 h-11 shrink-0 rounded-full bg-orange-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
                    <p className="text-[14px] text-slate-600 mt-0.5">{text}</p>
                    {link && (
                      <a
                        href={link.href}
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-block mt-1.5 text-[14px] font-medium text-orange-600 hover:text-orange-700 hover:underline break-all"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-black text-white p-6">
                <h3 className="text-lg font-serif">Planning a stay?</h3>
                <p className="text-[14px] text-white/70 mt-1">Check availability and reserve your room online in a few steps.</p>
                <Link
                  to="/booking"
                  className="mt-4 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeUp(0.2)} className={`lg:col-span-3 ${card} p-6 sm:p-8`}>
              <h2 className="text-2xl font-serif text-slate-900">Send us a message</h2>
              <p className="text-slate-600 text-[14px] mt-1 mb-6">Leave your details and we will get back to you.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className={label}>Full Name *</label>
                    <input id="fullName" type="text" name="fullName" placeholder="Your full name" required className={field} value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="email" className={label}>Email *</label>
                    <input id="email" type="email" name="email" placeholder="you@example.com" required className={field} value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className={label}>Subject *</label>
                  <input id="subject" type="text" name="subject" placeholder="How can we help?" required className={field} value={formData.subject} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="message" className={label}>Message *</label>
                  <textarea id="message" name="message" placeholder="Write your message..." required rows={5} className={`${field} resize-none`} value={formData.message} onChange={handleChange} />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-[14px] font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>

          {/* Google Maps Section */}
          <motion.div {...fadeUp(0.3)} className="mt-12 sm:mt-16">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-slate-900">Find Us Here</h2>
              <p className="mt-2 text-slate-600 text-[15px]">
                Located in Ejisu Ampabame, our hotel offers easy access to major attractions and landmarks.
              </p>
            </div>
            <div className={`${card} p-3 sm:p-4`}>
              <div className="aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.4876012776387!2d-1.5255319842775928!3d6.687003066179111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDEnMTkuMiJOIDHCsDMxJzI0LjAiVw!5e1!3m2!1sen!2sgh!4v1705590477065!5m2!1sen!2sgh&maptype=satellite"
                  title="Emson Hotel location map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-1 sm:px-2 pb-1">
                <p className="flex items-center gap-2 text-[14px] text-slate-600">
                  <MapPin className="w-4 h-4 text-orange-600" /> Emson Hotel, Ejisu Ampabame
                </p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=6.68700306617911,-1.5233433053500764"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Get Directions <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
