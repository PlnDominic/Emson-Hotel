import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Star, Users, Coffee, Award, Target, Eye, ArrowRight } from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Star, label: 'Years of Excellence', value: '3+' },
    { icon: Users, label: 'Happy Guests', value: '1000+' },
    { icon: Coffee, label: 'Room Service Hours', value: '24/7' },
    { icon: Award, label: 'Service Rating', value: '4.8' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      text: 'To provide unparalleled comfort and authentic Ghanaian hospitality.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      text: 'To be the premier destination for luxury accommodation in Ejisu Ampabame.',
    },
  ];

  const card = 'bg-white rounded-2xl border border-slate-200 shadow-sm';

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen bg-slate-50 pt-28 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="text-[12px] tracking-[0.2em] uppercase text-orange-600 font-semibold">Our Story</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-slate-900">
              About Emson <span className="text-orange-600">Hotel</span>
            </h1>
            <p className="mt-3 text-slate-600 text-[15px] leading-relaxed">
              Where luxury meets authentic Ghanaian hospitality in the heart of Ejisu Ampabame.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-10 sm:mb-14">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className={`${card} p-4 sm:p-6 text-center`}>
                <div className="w-11 h-11 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</div>
                <div className="text-[12px] sm:text-[13px] text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Story + video */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            <div className="space-y-6">
              <div className={`${card} p-6 sm:p-8`}>
                <h2 className="text-2xl font-serif text-slate-900 mb-4">Welcome to Emson Hotel</h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
                  <p>
                    Emson Hotel stands as a testament to luxury and comfort in the heart of Ejisu Ampabame.
                    Our journey began with a vision to create not just a hotel, but a sanctuary where modern
                    amenities meet traditional Ghanaian hospitality.
                  </p>
                  <p>
                    Our rooms are designed for comfortable and relaxed living. Our location on the hilltops
                    lets guests retreat and enjoy out-of-town comfort while overlooking the splendid sights
                    that the hospitable town of Ejisu Ampabame has to offer.
                  </p>
                  <p>
                    Our culinary experience is a celebration of flavours, offering dishes inspired by both
                    local and international cuisines. We pride ourselves on creating memorable experiences
                    that go beyond mere accommodation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {values.map(({ icon: Icon, title, text }) => (
                  <div key={title} className={`${card} p-6 border-t-4 border-t-orange-600`}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <Icon className="w-5 h-5 text-orange-600" />
                      <h3 className="text-[17px] font-semibold text-slate-900">{title}</h3>
                    </div>
                    <p className="text-[14px] text-slate-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-200 bg-slate-200 h-[360px] sm:h-[480px] lg:h-auto lg:min-h-[560px]">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/IMG_2637.MP4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-6">
                <p className="text-white font-serif text-lg">Experience Emson</p>
                <p className="text-white/80 text-[13px]">Ejisu Ampabame, Ghana</p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-12 sm:mt-16 rounded-2xl bg-black text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif">Ready to experience Emson?</h2>
              <p className="text-white/70 text-[14px] mt-1">Check availability and reserve your room online in a few steps.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Book Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
