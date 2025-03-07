import React from 'react';
import { Navbar } from './components/Navbar';
import { Star, Users, Coffee, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Star, label: 'Years of Excellence', value: '3+' },
    { icon: Users, label: 'Happy Guests', value: '1000+' },
    { icon: Coffee, label: 'Room Service Hours', value: '24/7' },
    { icon: Award, label: 'Service Rating', value: '4.8' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="w-full pt-24 pb-12 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-4xl font-serif text-gray-900 mb-4 sm:mb-6">
                About{' '}
                <span className="relative">
                  Lavimac Royal
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 transform origin-left"></span>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Where luxury meets authentic Ghanaian hospitality in the heart of Ejisu Ampabame
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2 sm:px-0">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col items-center text-center">
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2 sm:mb-3" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</span>
                    <span className="text-xs sm:text-sm text-gray-600">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Content Side */}
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-4 sm:space-y-6">
                  <p className="leading-relaxed text-sm sm:text-base text-gray-600">
                    "Established in 2020, Lavimac Royal Hotel stands as a testament to luxury and comfort 
                    in the heart of Ejisu Ampabame. Our journey began with a vision to create not just a hotel, 
                    but a sanctuary where modern amenities meet traditional Ghanaian hospitality.
                  </p>
                  <p className="leading-relaxed text-sm sm:text-base text-gray-600">
                    The Lavimac Royal Hotel has superior room features designed for comfortable and relaxed living. 
                    Our strategic location allows guests to retreat and marvel at the out-of-town comfort while 
                    overlooking the splendid sights that the hospitable town of Ejisu Ampabame has to offer.
                  </p>

                  <p className="leading-relaxed text-sm sm:text-base text-gray-600">
                    Our culinary experience is a celebration of flavors, offering a variety of dishes inspired by 
                    both local and international cuisines. We pride ourselves on creating memorable experiences 
                    that go beyond mere accommodation."
                  </p>
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">Our Mission</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-yellow-400/30">
                        To provide unparalleled comfort and authentic Ghanaian hospitality.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">Our Vision</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-yellow-400/30">
                        To be the premier destination for luxury accommodation in Ejisu Ampabame.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Side */}
              <div className="relative overflow-hidden shadow-2xl h-[600px] group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/IMG_2637.MP4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
