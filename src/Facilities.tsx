import React from 'react';
import { Navbar } from './components/Navbar';
import { Clock, Wifi, Music, Utensils, Users, Tv } from 'lucide-react';
import wifiImg from './assets/wifi.jpg';
import dstvImg from './assets/dstv.jpg';
import restaurantImg from './assets/restaurant.jpg';
import liveBandImg from './assets/live-band.jpg';
import conferenceImg from './assets/conference.jpg';

interface FacilityProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: any;
  index: number;
}

const FacilityCard: React.FC<FacilityProps> = ({ title, description, icon, image, index }) => (
  <div 
    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out"
    style={{
      opacity: 0,
      animation: `fadeIn 0.5s ease-out forwards ${index * 0.2}s`
    }}
  >
    <div className="relative h-48 overflow-hidden group">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
    </div>
    <div className="p-6 transform translate-y-0 hover:translate-y-[-5px] transition-transform duration-300">
      <div className="flex items-center mb-2">
        <div className="text-[rgb(0,0,115)] mr-2 transform rotate-0 hover:rotate-12 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-serif text-gray-900 hover:text-[rgb(0,0,115)] transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const Facilities: React.FC = () => {
  const facilities = [
    {
      title: "Free Wi-Fi",
      description: "Stay connected with our high-speed internet access available throughout the hotel premises, perfect for both business and leisure travelers.",
      icon: <Wifi className="h-6 w-6" />,
      image: wifiImg
    },
    {
      title: "DSTV",
      description: "Enjoy premium entertainment with our DSTV service, featuring a wide range of international channels and programs in all our rooms.",
      icon: <Tv className="h-6 w-6" />,
      image: dstvImg
    },
    {
      title: "Bar & Restaurant",
      description: "Savor delicious local and international cuisine at our restaurant, complemented by a well-stocked bar offering fine wines and spirits.",
      icon: <Utensils className="h-6 w-6" />,
      image: restaurantImg
    },
    {
      title: "Live Band",
      description: "Experience vibrant entertainment with our live band performances, creating the perfect atmosphere for your evening enjoyment.",
      icon: <Music className="h-6 w-6" />,
      image: liveBandImg
    },
    {
      title: "Conference Room",
      description: "Host successful meetings and events in our well-equipped conference room, featuring modern amenities and professional services.",
      icon: <Users className="h-6 w-6" />,
      image: conferenceImg
    }
  ];

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <Navbar />
      <section className="w-full py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16"
               style={{
                 opacity: 0,
                 animation: 'slideIn 0.8s ease-out forwards'
               }}>
            <h2 className="text-4xl font-serif text-gray-900 mb-4 relative inline-block">
              World-Class Facilities
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[rgb(0,0,115)] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our range of premium amenities designed to make your stay exceptional and memorable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <FacilityCard key={index} {...facility} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Facilities;
