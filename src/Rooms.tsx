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
  <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
    <div className="relative h-60 sm:h-72 overflow-hidden">
      <img src={image} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3.5 py-1.5 shadow-sm">
        <span className="text-[15px] font-bold text-orange-600">GH₵{price}</span>
        <span className="text-[12px] text-slate-500 ml-1">/ night</span>
      </div>
    </div>
    <div className="p-5 sm:p-6 flex flex-col flex-1">
      <h3 className="text-xl font-serif text-slate-900">{title}</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center text-[14px] text-slate-600">
            <span className="mr-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50">
              <Check className="h-3 w-3 text-orange-600" strokeWidth={3} />
            </span>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
      <Link
        to="/booking"
        className="mt-auto block w-full text-center bg-orange-600 text-white text-[14px] font-semibold py-3 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Book Now
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
      <section className="w-full bg-slate-50 pt-28 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="text-[12px] tracking-[0.2em] uppercase text-orange-600 font-semibold">Accommodation</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-slate-900">Our Rooms</h1>
            <p className="mt-3 text-slate-600 text-[15px] leading-relaxed">
              Comfortable, well-appointed rooms for a relaxing stay in Ejisu Ampabame.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {roomsData.map((room, index) => (
              <RoomCard key={index} {...room} />
            ))}
          </div>
          <div className="mt-12 sm:mt-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h2 className="text-xl font-serif text-slate-900">Ready to book your stay?</h2>
              <p className="text-slate-600 text-[14px] mt-1">Pick your dates and reserve a room in a few steps.</p>
            </div>
            <Link
              to="/booking"
              className="shrink-0 bg-black hover:bg-neutral-800 text-white text-[14px] font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Rooms;
