import React from 'react';
import { Navbar } from './components/Navbar';
import { Link } from 'react-router-dom';
import roomImage1 from './assets/The_Penthouse_1.jpg';
import roomImage2 from './assets/standard deluxe 1.jpg';
import roomImage3 from './assets/The_Penthouse_2.jpg';
import roomImage4 from './assets/standard deluxe 2.jpg';
import { Check } from 'lucide-react';

const RoomCard: React.FC<{
  image: string;
  title: string;
  price: string;
  amenities: string[];
  alt: string;
}> = ({ image, title, price, amenities, alt }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="relative h-64">
      <img src={image} alt={alt} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-serif text-gray-900 mb-2">{title}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-2xl font-bold text-[rgb(0,0,115)]">GH₵{price}</span>
        <span className="text-gray-600 text-sm ml-1">per night</span>
      </div>
      <div className="space-y-2 mb-6">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center text-gray-600">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
      <Link to="/booking" className="block">
        <button className="w-full bg-[rgb(0,0,115)] text-white py-2 rounded-md hover:bg-[rgb(0,0,150)] transition-colors">
          Book Now
        </button>
      </Link>
    </div>
  </div>
);

const Rooms: React.FC = () => {
  const roomsData = [
    {
      image: roomImage1,
      title: "Penthouse Room",
      price: "250",
      alt: "Penthouse Room",
      amenities: ["King size bed", "Free Wi-Fi", "Mini bar", "Room service"]
    },
    {
      image: roomImage2,
      title: "Standard Deluxe Room",
      price: "250",
      alt: "Standard Deluxe Room",
      amenities: ["Queen size bed", "Free Wi-Fi", "Mini fridge", "Daily housekeeping"]
    },
    {
      image: roomImage3,
      title: "Penthouse Room",
      price: "250",
      alt: "Penthouse Room",
      amenities: ["King size bed", "Free Wi-Fi", "Mini bar", "Room service"]
    },
    {
      image: roomImage4,
      title: "Standard Deluxe Room",
      price: "250",
      alt: "Standard Deluxe Room",
      amenities: ["Queen size bed", "Free Wi-Fi", "Mini fridge", "Daily housekeeping"]
    }
  ];

  return (
    <>
      <Navbar />
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roomsData.map((room, index) => (
              <RoomCard key={index} {...room} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Rooms;
