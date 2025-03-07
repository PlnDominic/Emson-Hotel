import React, { useState } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function BookingWidget() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests
    }).toString();
    return `/booking?${queryParams}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto -mt-16 relative z-20 border border-white/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Check In */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <label className="block text-[6px] text-white/80 font-medium mb-1">Check In</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent border-none text-[7px] text-white placeholder-white/60 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Check Out */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <label className="block text-[6px] text-white/80 font-medium mb-1">Check Out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent border-none text-[7px] text-white placeholder-white/60 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <label className="block text-[6px] text-white/80 font-medium mb-1">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent border-none text-[7px] text-white focus:ring-0 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="1 Adult" className="text-gray-900 text-[7px]">1 Adult</option>
                <option value="2 Adults" className="text-gray-900 text-[7px]">2 Adults</option>
                <option value="3 Adults" className="text-gray-900 text-[7px]">3 Adults</option>
                <option value="4 Adults" className="text-gray-900 text-[7px]">4 Adults</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Link 
          to={handleSearch()} 
          className="bg-white/10 hover:bg-white backdrop-blur-sm text-white hover:text-black rounded-xl p-4 flex items-center justify-center space-x-2 transition-all duration-300 group"
        >
          <Search size={20} className="transition-transform group-hover:scale-110" />
          <span className="font-medium text-[7px]">Search</span>
        </Link>
      </div>
    </div>
  );
}
