import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Printer, Check, LucideProps } from 'lucide-react';

import roomImage1 from './assets/standard single 1.jpg';
import roomImage2 from './assets/standard single 2.jpg';
import roomImage3 from './assets/standard deluxe 1.jpg';
import roomImage4 from './assets/standard deluxe 2.jpg';
import roomImage5 from './assets/The_Penthouse_1.jpg';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://lavimacroyalhotel.com/api'
    : 'http://localhost:3001/api');

// Custom CediSign icon component
const CediSign = React.forwardRef<SVGSVGElement, LucideProps>((props, ref) => {
  const { size = 24, className = "", ...rest } = props;
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M4 18h6" />
    </svg>
  );
});

CediSign.displayName = 'CediSign';

interface BookingStep {
  number: number;
  title: string;
  icon: React.ComponentType<LucideProps>;
}

const steps: BookingStep[] = [
  { number: 1, title: 'Select Date', icon: Calendar },
  { number: 2, title: 'Select Room', icon: User },
  { number: 3, title: 'Payment', icon: CediSign },
  { number: 4, title: 'Complete', icon: Check },
];

// Date utility functions
const isDateInPast = (day: number, month: number, year: number): boolean => {
  const today = new Date();
  const date = new Date(year, month, day);
  return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const generateCalendarDays = (year: number, month: number): (number | null)[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  
  // Add the days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(i);
  }
  
  return days;
};

// Room Types
const roomTypes = [
  {
    type: 'Standard Single Room',
    images: [roomImage1, roomImage2],
    price: 220.00,
    currency: '₵'
  },
  {
    type: 'Standard Deluxe Room',
    images: [roomImage3, roomImage4],
    price: 250.00,
    currency: '₵'
  },
  {
    type: 'Penthouse Room',
    images: [roomImage5], // Removed unused images
    price: 250.00,
    currency: '₵'
  }
];

// Feedback Message Component
const FeedbackMessage: React.FC<{ feedback: { type: 'success' | 'error'; message: string } | null }> = ({ feedback }) => {
  if (!feedback) return null;
  
  return (
    <div className={`fixed top-4 right-4 p-3 sm:p-4 rounded-lg shadow-lg ${
      feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white max-w-[90%] sm:max-w-md z-50 animate-fade-in text-sm sm:text-base`}>
      <p className="flex items-center">
        {feedback.type === 'success' ? '✓' : '⚠'} {feedback.message}
      </p>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  showConfirmModal: boolean;
  checkInDate: string | null;
  checkOutDate: string | null;
  selectedRoom: { type: string; currency: string } | null;
  calculateTotalPrice: () => number;
  setShowConfirmModal: (show: boolean) => void;
  handleCompleteBooking: () => void;
}> = ({
  showConfirmModal,
  checkInDate,
  checkOutDate,
  selectedRoom,
  calculateTotalPrice,
  setShowConfirmModal,
  handleCompleteBooking
}) => {
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Booking</h3>
        <p className="mb-3 sm:mb-4 text-sm sm:text-base">Please confirm your booking details:</p>
        <div className="space-y-2 mb-4 sm:mb-6 text-sm sm:text-base">
          <p><strong>Check-in:</strong> {checkInDate && new Date(checkInDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {checkOutDate && new Date(checkOutDate).toLocaleDateString()}</p>
          <p><strong>Room:</strong> {selectedRoom?.type}</p>
          <p><strong>Total:</strong> {selectedRoom?.currency} {calculateTotalPrice().toFixed(2)}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded text-sm sm:text-base hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowConfirmModal(false);
              handleCompleteBooking();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base hover:bg-blue-600 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

const Booking = () => {
  // State declarations
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [selectedRoomCount, setSelectedRoomCount] = useState(1);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<null | typeof roomTypes[0]>(null);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Utility functions that depend on state
  const isDateInRange = (day: number | null, month: number, year: number): boolean => {
    if (day === null || !checkInDate || !checkOutDate) return false;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const current = new Date(year, month, day);
    return current >= start && current <= end;
  };

  const calculateNumberOfNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNumberOfNights();
    return selectedRoom.price * nights * selectedRoomCount;
  };

  // Event handlers
  const handleDateSelection = (day: number) => {
    if (!isDateInPast(day, currentMonth.getMonth(), currentMonth.getFullYear())) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };

  const handleSelectChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  const handleDateClick = (day: number | null, month: number, year: number) => {
    if (day === null) return;
    
    const date = new Date(year, month, day);
    const formattedDate = date.toISOString().split('T')[0];
    if (!checkInDate) {
      setCheckInDate(formattedDate);
    } else if (!checkOutDate && formattedDate !== checkInDate) {
      setCheckOutDate(formattedDate);
    } else {
      setCheckInDate(formattedDate);
      setCheckOutDate(null);
    }
  };

  const handleSearch = () => {
    if (checkInDate && checkOutDate) {
      setShowRoomSelection(true);
      setActiveStep(2);
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    if (method !== 'momo') {
      setPaymentProof(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleCompleteBooking = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) {
      setFeedback({ type: 'error', message: 'Please complete all required booking information.' });
      return;
    }

    try {
      setIsLoading(true);

      // Generate booking ID
      const bookingId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

      // Create HTML email content
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1a237e; text-align: center; margin-bottom: 30px; font-size: 24px;">Emson Hotel - Booking Confirmation</h1>

          <p style="color: #333; margin-bottom: 20px;">Dear ${firstName} ${lastName || ''},</p>

          <p style="color: #333; line-height: 1.6;">Thank you for booking with Emson Hotel. We are happy to confirm that your booking has been successfully placed and we look forward to seeing you on ${new Date(checkInDate).toLocaleDateString()} for your ${calculateNumberOfNights()} nights stay with us. For full details of your reservation please see below:</p>

          <div style="background-color: #f8f9fa; padding: 25px; margin: 30px 0; border-radius: 6px;">
            <h2 style="color: #1a237e; margin-bottom: 20px; font-size: 20px;">Booking Details</h2>
            
            <div style="color: #333; line-height: 1.8;">
              <p><strong style="color: #1a237e;">Booking ID:</strong> #${bookingId}</p>
              <p><strong style="color: #1a237e;">Room Type:</strong> ${selectedRoom.type}</p>
              <p><strong style="color: #1a237e;">Check-in:</strong> ${new Date(checkInDate).toLocaleDateString()}</p>
              <p><strong style="color: #1a237e;">Check-out:</strong> ${new Date(checkOutDate).toLocaleDateString()}</p>
              <p><strong style="color: #1a237e;">Number of Nights:</strong> ${calculateNumberOfNights()}</p>
              <p><strong style="color: #1a237e;">Guests:</strong> ${adultCount} Adults, ${childCount} Children</p>
              <p><strong style="color: #1a237e;">Total Amount:</strong> ${selectedRoom.currency}${calculateTotalPrice().toFixed(2)}</p>
              <p><strong style="color: #1a237e;">Payment Method:</strong> ${selectedPaymentMethod === 'momo' ? 'Mobile Money' : 'Pay on Arrival'}</p>
            </div>
          </div>

          <div style="background-color: #f0f2f5; padding: 25px; margin-top: 30px; border-radius: 6px;">
            <h3 style="color: #1a237e; margin-bottom: 15px; font-size: 18px;">Need assistance?</h3>
            <p style="color: #333; margin-bottom: 10px;">Contact us at:</p>
            <p style="color: #333; margin-bottom: 5px;">Email: <a href="mailto:info@emsonhotel.com" style="color: #1a237e; text-decoration: none;">info@emsonhotel.com</a></p>
            <p style="color: #333;">Phone: +233 249676262</p>
          </div>
        </div>
      `;

      // Create form data for the request
      const formData = new FormData();
      formData.append('to', email); // Send to guest's email
      formData.append('subject', 'Booking Confirmation - Emson Hotel');
      formData.append('text', emailTemplate);

      // If payment proof is available, append it
      if (selectedPaymentMethod === 'momo' && paymentProof) {
        formData.append('paymentProof', paymentProof);
      }

      // Send confirmation email to guest
      const response = await fetch(import.meta.env.PROD ? '/api/send-email' : 'http://localhost:3001/api/send-email', {
        method: 'POST',
        body: formData
      });

      let errorMessage = 'Failed to send booking confirmation. Please try again.';
      
      try {
        const data = await response.json();
        if (!response.ok) {
          errorMessage = data.error || data.details || errorMessage;
          throw new Error(errorMessage);
        }

        // Send notification to hotel
        const hotelNotification = new FormData();
        hotelNotification.append('to', 'info@emsonhotel.com');
        hotelNotification.append('subject', `New Booking Alert - #${bookingId}`);
        hotelNotification.append('text', emailTemplate);

        if (selectedPaymentMethod === 'momo' && paymentProof) {
          hotelNotification.append('paymentProof', paymentProof);
        }

        await fetch(import.meta.env.PROD ? '/api/send-email' : 'http://localhost:3001/api/send-email', {
          method: 'POST',
          body: hotelNotification
        });

        setFeedback({ type: 'success', message: 'Booking confirmed! Check your email for details.' });
        setActiveStep(4); // Move to completion step
      } catch (parseError) {
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete booking. Please try again.';
      setFeedback({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (email: string) => {
    try {
      setIsLoading(true);
      await fetch(`/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Booking Confirmation - Emson Hotel',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d; text-align: center; padding: 20px;">Booking Confirmation</h1>
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px;">
                <h2 style="color: #2d3748;">Thank you for booking with Emson Hotel!</h2>
                <div style="margin: 20px 0;">
                  <h3 style="color: #4a5568;">Booking Details:</h3>
                  <p><strong>Check-in:</strong> ${checkInDate && new Date(checkInDate).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> ${checkOutDate && new Date(checkOutDate).toLocaleDateString()}</p>
                  <p><strong>Room:</strong> ${selectedRoom?.type}</p>
                  <p><strong>Number of Nights:</strong> ${calculateNumberOfNights()}</p>
                  <p><strong>Total Amount:</strong> ${selectedRoom?.currency} ${calculateTotalPrice()}</p>
                </div>
                <div style="background-color: #e2e8f0; padding: 15px; border-radius: 4px; margin-top: 20px;">
                  <p style="margin: 0;"><strong>Need assistance?</strong></p>
                  <p style="margin: 5px 0;">Contact us at: support@emsonhotel.com</p>
                  <p style="margin: 5px 0;">Phone: +233 248676262</p>
                </div>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 0.875rem;">
                <p>Emson Hotel</p>
                <p>123 Main Street, Accra, Ghana</p>
              </div>
            </div>
          `
        }),
      });
      setFeedback({ type: 'success', message: 'Booking confirmation email sent successfully!' });
    } catch (error) {
      console.error('Failed to send email:', error);
      setFeedback({ type: 'error', message: 'Failed to send confirmation email. Please contact support.' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendSMS = async (numbers: string[]) => {
    try {
      setIsLoading(true);
      await Promise.all(numbers.map(number => 
        fetch(`/api/send-sms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: number,
            message: `New booking at Emson Hotel:
Room: ${selectedRoom?.type}
Check-in: ${checkInDate && new Date(checkInDate).toLocaleDateString()}
Check-out: ${checkOutDate && new Date(checkOutDate).toLocaleDateString()}
Nights: ${calculateNumberOfNights()}
Total: ${selectedRoom?.currency} ${calculateTotalPrice().toFixed(2)}
Guest Contact: [Guest Phone Number]
Thank you for choosing Emson!`
          }),
        })
      ));
      setFeedback({ type: 'success', message: 'Booking notifications sent successfully!' });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      setFeedback({ type: 'error', message: 'Failed to send SMS notifications. Please contact support.' });
    } finally {
      setIsLoading(false);
    }
  };

  const printReceipt = () => {
    const receiptContent = document.createElement('div');
    receiptContent.innerHTML = `
      <div style="padding: 20px; max-width: 400px; margin: 0 auto;">
        <h2 style="text-align: center;">Emson Hotel</h2>
        <h3 style="text-align: center;">Booking Receipt</h3>
        <hr />
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Check-in:</strong> ${checkInDate}</p>
        <p><strong>Check-out:</strong> ${checkOutDate}</p>
        <p><strong>Room Type:</strong> ${selectedRoom?.type}</p>
        <p><strong>Number of Nights:</strong> ${calculateNumberOfNights()}</p>
        <p><strong>Total Amount:</strong> ${selectedRoom?.currency} ${calculateTotalPrice()}</p>
        <hr />
        <p style="text-align: center; font-size: 12px;">Thank you for choosing Emson Hotel!</p>
      </div>
    `;

    const printWindow = window.open('', '', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Receipt</title>
          </head>
          <body>
            ${receiptContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleSubmit = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) {
      setFeedback({ type: 'error', message: 'Please complete all required booking information.' });
      return;
    }

    try {
      setIsLoading(true);

      // Send email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          to: 'info@emsonhotel.com',
          subject: 'New Booking - Emson Hotel',
          text: `New booking details:
Room: ${selectedRoom.type}
Check-in: ${new Date(checkInDate).toLocaleDateString()}
Check-out: ${new Date(checkOutDate).toLocaleDateString()}
Nights: ${calculateNumberOfNights()}
Total: ${selectedRoom.currency} ${calculateTotalPrice().toFixed(2)}
Guest Contact: [Guest Phone Number]
Thank you for choosing Emson!`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to send booking confirmation. Please try again.');
      }

      setFeedback({ type: 'success', message: 'Booking confirmed! Check your email for details.' });
      setActiveStep(4); // Move to completion step
    } catch (error) {
      console.error('Error completing booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete booking. Please try again.';
      setFeedback({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setActiveStep(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-12 px-4">
      <FeedbackMessage feedback={feedback} />
      <ConfirmationModal 
        showConfirmModal={showConfirmModal}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        selectedRoom={selectedRoom}
        calculateTotalPrice={calculateTotalPrice}
        setShowConfirmModal={setShowConfirmModal}
        handleCompleteBooking={handleCompleteBooking}
      />
      
      {/* Add loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-8">
        {/* Progress Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-black/80 p-3 sm:p-8 mb-6 sm:mb-12 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 sm:w-12 sm:h-12 rounded-full shrink-0 ${
                    activeStep >= step.number
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/60'
                  } transition-all duration-300`}>
                    <step.icon className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-[1px] flex-1 mx-1 sm:mx-4 ${
                      activeStep > step.number
                        ? 'bg-white'
                        : 'bg-white/10'
                    } transition-all duration-300`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div key={step.number} className="flex-1 text-center">
                  <span className="text-[10px] sm:text-sm text-white/80 block leading-tight">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-lg p-8 mb-8 transform transition-all duration-300">
            {/* Date Selection Step */}
            {activeStep === 1 && (
              <div className="space-y-8">                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Panel - Hotel Selection */}
                  <div className="bg-black p-6 shadow-md">
                    <h3 className="text-[14px] font-semibold text-white mb-6">Booking Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-[14px] mb-1">Adults</p>
                        <select 
                          value={adultCount} 
                          onChange={(e) => handleSelectChange(e.target.value, setAdultCount)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-[14px]"
                        >
                          {[1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[14px] mb-1">Children</p>
                        <select 
                          value={childCount} 
                          onChange={(e) => handleSelectChange(e.target.value, setChildCount)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-[14px]"
                        >
                          {[0, 1, 2, 3].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[14px] mb-1">Rooms</p>
                        <select 
                          value={roomCount} 
                          onChange={(e) => handleSelectChange(e.target.value, setRoomCount)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-[14px]"
                        >
                          {[1, 2, 3].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        className="mt-6 w-full bg-black text-white py-3 rounded border border-white hover:bg-gray-800 text-[14px]"
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="md:col-span-2 bg-black p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 text-white hover:bg-gray-800 rounded-full">
                        <ChevronLeft size={24} />
                      </button>
                      <div className="text-[14px] mx-4 text-white font-semibold">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-white hover:bg-gray-800 rounded-full">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center py-2 text-gray-400">
                          {day}
                        </div>
                      ))}
                      {generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((day, index) => (
                        <div
                          key={index}
                          className={`text-center py-2 ${
                            day === null
                              ? ''
                              : isDateInPast(day, currentMonth.getMonth(), currentMonth.getFullYear())
                              ? 'text-gray-600 cursor-not-allowed'
                              : isDateInRange(day, currentMonth.getMonth(), currentMonth.getFullYear())
                              ? 'bg-blue-900 bg-opacity-50 text-white cursor-pointer'
                              : 'text-white cursor-pointer hover:bg-gray-800'
                          }`}
                          onClick={() => {
                            if (day !== null && !isDateInPast(day, currentMonth.getMonth(), currentMonth.getFullYear())) {
                              handleDateClick(day, currentMonth.getMonth(), currentMonth.getFullYear());
                            }
                          }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-center text-gray-400">
                      Select your dates by clicking on the calendar above
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-white text-[14px]">Check-in: {checkInDate ? new Date(checkInDate).toLocaleDateString() : 'Not selected'}</p>
                      <p className="text-white text-[14px]">Check-out: {checkOutDate ? new Date(checkOutDate).toLocaleDateString() : 'Not selected'}</p>
                      <p className="text-white text-[14px]">Total Nights: {checkInDate && checkOutDate ? calculateNumberOfNights() : '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Room Selection Step */}
            {activeStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8 bg-gray-900 p-8 shadow-lg">
                  <h2 className="text-[14px] font-bold text-white mb-2">Select Your Room</h2>
                  <p className="text-gray-400 text-[14px]">Choose from our luxurious room options</p>
                </div>

                <div className="max-w-4xl mx-auto mt-8">
                  <div className="bg-gray-900 p-6 shadow-lg">
                    <h3 className="text-[14px] font-semibold text-white mb-6">Available Rooms</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {roomTypes.map((room, index) => (
                        <div
                          key={index}
                          className={`bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:bg-black/70 cursor-pointer transform hover:-translate-y-1 ${
                            selectedRoom?.type === room.type ? 'ring-2 ring-white' : ''
                          }`}
                          onClick={() => {
                            setSelectedRoom(room);
                            setSelectedRoomCount(1);
                          }}
                        >
                          <div className="flex">
                            <div className="w-48 h-48 relative">
                              <img
                                src={room.images[0]}
                                alt={room.type}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-[14px] font-semibold text-white">{room.type}</h4>
                                    <p className="text-white/60 mt-1 text-[14px]">Experience luxury and comfort</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-[14px] font-bold text-white">{room.currency}{room.price}</div>
                                    <div className="text-[14px] text-white/60">per night</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[14px] text-white/80">Room Count:</span>
                                    <select
                                      value={selectedRoomCount}
                                      onChange={(e) => setSelectedRoomCount(parseInt(e.target.value))}
                                      className="bg-white/10 text-[14px] text-white border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-white"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {[1, 2, 3].map(num => (
                                        <option key={num} value={num} className="bg-gray-900">{num}</option>
                                      ))}
                                    </select>
                                  </div>
                                  {selectedRoom?.type === room.type && (
                                    <div className="bg-white/20 text-[14px] text-white px-3 py-1 rounded-full">
                                      Selected
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPayment(true);
                                    setActiveStep(3);
                                  }}
                                  className="bg-white/10 hover:bg-white/20 text-[14px] text-white px-6 py-2 rounded-lg transition-all duration-300"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {activeStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8 bg-gray-900 p-8 shadow-lg">
                  <h2 className="text-[14px] font-bold text-white mb-2">Payment Details</h2>
                  <p className="text-gray-400 text-[14px]">Complete your booking with secure payment</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Booking Summary */}
                  <div className="bg-gray-900 p-6 shadow-lg">
                    <h3 className="text-[14px] font-semibold text-white mb-6">Booking Summary</h3>
                    <div className="space-y-4">
                      <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-[14px] mb-2">Check-in Date</p>
                        <p className="text-[14px] font-bold text-white">{checkInDate && new Date(checkInDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-[14px] mb-2">Check-out Date</p>
                        <p className="text-[14px] font-bold text-white">{checkOutDate && new Date(checkOutDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-[14px] mb-2">Room Type</p>
                        <p className="text-[14px] font-bold text-white">{selectedRoom?.type}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-[14px] mb-2">Room Count</p>
                        <p className="text-[14px] font-bold text-white">{selectedRoomCount}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-[14px] mb-2">Number of Nights</p>
                        <p className="text-[14px] font-bold text-white">{calculateNumberOfNights()}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-[14px] mb-2">Price per Night</p>
                        <p className="text-[14px] font-bold text-white">{selectedRoom?.currency} {selectedRoom?.price}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-[14px] mb-2">Total Amount</p>
                        <p className="text-[14px] font-bold text-white">{selectedRoom?.currency} {calculateTotalPrice().toFixed(2)}</p>
                        <p className="text-[12px] text-gray-400 mt-1">
                          ({selectedRoomCount} {selectedRoomCount === 1 ? 'room' : 'rooms'} × {calculateNumberOfNights()} {calculateNumberOfNights() === 1 ? 'night' : 'nights'} × {selectedRoom?.currency} {selectedRoom?.price})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="md:col-span-2 bg-gray-900 p-6 shadow-lg">
                    <h3 className="text-[14px] font-semibold text-white mb-6">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-gray-400 text-[14px] mb-2">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-black/50 text-white text-[14px] rounded-lg border-none focus:ring-2 focus:ring-white/20 p-3"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[14px] mb-2">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-black/50 text-white text-[14px] rounded-lg border-none focus:ring-2 focus:ring-white/20 p-3"
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[14px] mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-black/50 text-white text-[14px] rounded-lg border-none focus:ring-2 focus:ring-white/20 p-3"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[14px] mb-2">Phone</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-black/50 text-white text-[14px] rounded-lg border-none focus:ring-2 focus:ring-white/20 p-3"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <h3 className="text-[14px] font-semibold text-white mb-6">Payment Method</h3>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-4 bg-black/50 p-4 rounded-lg cursor-pointer hover:bg-black/70 transition-all duration-300"
                           onClick={() => handlePaymentMethodChange('momo')}>
                        <input
                          type="radio"
                          checked={selectedPaymentMethod === 'momo'}
                          onChange={() => handlePaymentMethodChange('momo')}
                          className="text-white focus:ring-white"
                        />
                        <div>
                          <p className="text-[14px] font-medium text-white">Mobile Money</p>
                          <p className="text-[14px] text-gray-400">Pay via Mobile Money transfer</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 bg-black/50 p-4 rounded-lg cursor-pointer hover:bg-black/70 transition-all duration-300"
                           onClick={() => handlePaymentMethodChange('arrival')}>
                        <input
                          type="radio"
                          checked={selectedPaymentMethod === 'arrival'}
                          onChange={() => handlePaymentMethodChange('arrival')}
                          className="text-white focus:ring-white"
                        />
                        <div>
                          <p className="text-[14px] font-medium text-white">Pay on Arrival</p>
                          <p className="text-[14px] text-gray-400">Pay at the hotel during check-in</p>
                        </div>
                      </div>
                    </div>

                    {selectedPaymentMethod === 'momo' && (
                      <div className="mb-8">
                        <p className="text-[14px] text-white mb-4">
                        Please make payment to: <span className="font-semibold">+233 248676262 OR +233 551390039</span>
                        </p>
                        <div className="bg-black/50 p-4 rounded-lg">
                          <label className="block text-gray-400 text-[14px] mb-2">Upload Payment Proof</label>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="w-full text-[14px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[14px] file:bg-white/10 file:text-white hover:file:bg-white/20"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={handleCompleteBooking}
                        disabled={isLoading}
                        className="bg-white/10 hover:bg-white/20 text-[14px] text-white px-8 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <span>Complete Booking</span>
                            <ChevronRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Completed Step */}
            {activeStep === 4 && (
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-600 text-lg">Your reservation has been successfully completed.</p>
                </div>

                {feedback?.type === 'success' && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-8 w-full">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
                    <div className="space-y-3 text-gray-600">
                      <p>{feedback.message}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">
                      <span className="font-semibold">Next Steps:</span> You will receive a confirmation email shortly with your booking details.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      <span>Make Another Booking</span>
                    </button>
                    
                    <a
                      href="/"
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span>Return Home</span>
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 w-full">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                    <p className="text-gray-600">Contact our support team</p>
                    <div className="flex justify-center space-x-4 mt-3">
                      <a href="tel:+233248676262" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        +233 248676262
                      </a>
                      <a href="mailto:info@emsonhotel.com" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        Email Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;