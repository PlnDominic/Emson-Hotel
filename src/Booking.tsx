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
    <div className={`fixed top-20 right-4 p-3 sm:p-4 rounded-xl shadow-lg border bg-white ${
      feedback.type === 'success' ? 'border-green-200 text-green-800' : 'border-red-200 text-red-700'
    } max-w-[90%] sm:max-w-md z-50 animate-fade-in text-sm sm:text-base`}>
      <p className="flex items-center gap-2">
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs ${
          feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>{feedback.type === 'success' ? '✓' : '!'}</span>
        {feedback.message}
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
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xl w-full max-w-md text-slate-700">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">Confirm Booking</h3>
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
            className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm sm:text-base hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowConfirmModal(false);
              handleCompleteBooking();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-[rgb(0,0,115)] text-white rounded-lg text-sm sm:text-base hover:bg-[rgb(0,0,150)] transition-colors"
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
            <p style="color: #333; margin-bottom: 5px;">Email: <a href="mailto:info.emsonhotel@gmail.com" style="color: #1a237e; text-decoration: none;">info.emsonhotel@gmail.com</a></p>
            <p style="color: #333;">Phone: +233(0)535140377</p>
          </div>
        </div>
      `;

      // Create form data for the request
      const formData = new FormData();
      formData.append('to', email); // Send to guest's email
      formData.append('subject', 'Booking Confirmation - Emson Hotel');
      formData.append('text', emailTemplate);
      // The API also emails the hotel a copy with the guest's contact details
      formData.append('notifyHotel', '1');
      formData.append('bookingId', bookingId);
      formData.append('guestName', `${firstName} ${lastName}`.trim());
      formData.append('guestEmail', email);
      formData.append('guestPhone', phone);

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
                  <p style="margin: 5px 0;">Contact us at: info.emsonhotel@gmail.com</p>
                  <p style="margin: 5px 0;">Phone: +233(0)535140377</p>
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
          to: 'info.emsonhotel@gmail.com',
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

  const navy = 'bg-[rgb(0,0,115)] hover:bg-[rgb(0,0,150)] text-white';
  const card = 'bg-white rounded-2xl border border-slate-200 shadow-sm';
  const label = 'block text-[13px] font-medium text-slate-600 mb-1.5';
  const field = 'w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[rgb(0,0,115)] focus:ring-2 focus:ring-[rgb(0,0,115)]/15 transition';
  const toIso = (day: number) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-12 px-4">
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
      
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-[rgb(0,0,115)]"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-4 sm:pb-8">
        <div className="max-w-5xl mx-auto text-center mb-6 sm:mb-8">
          <p className="text-[12px] tracking-[0.2em] uppercase text-orange-600 font-semibold">Reservations</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-serif text-slate-900">Book Your Stay</h1>
        </div>

        {/* Progress Steps */}
        <div className="max-w-5xl mx-auto">
          <div className={`${card} p-4 sm:p-6 mb-6 sm:mb-8`}>
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full shrink-0 transition-all duration-300 ${
                    activeStep > step.number
                      ? 'bg-orange-500 text-white'
                      : activeStep === step.number
                      ? 'bg-[rgb(0,0,115)] text-white ring-4 ring-[rgb(0,0,115)]/10'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1.5 sm:mx-4 rounded-full transition-all duration-300 ${
                      activeStep > step.number ? 'bg-orange-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <span key={step.number} className={`text-[10px] sm:text-[13px] leading-tight ${
                  activeStep >= step.number ? 'text-slate-900 font-medium' : 'text-slate-400'
                }`}>{step.title}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            {/* Date Selection Step */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Guests */}
                <div className={`${card} p-5 sm:p-6`}>
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-5">Booking Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={label}>Adults</label>
                      <select value={adultCount} onChange={(e) => handleSelectChange(e.target.value, setAdultCount)} className={field}>
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={label}>Children</label>
                      <select value={childCount} onChange={(e) => handleSelectChange(e.target.value, setChildCount)} className={field}>
                        {[0, 1, 2, 3].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={label}>Rooms</label>
                      <select value={roomCount} onChange={(e) => handleSelectChange(e.target.value, setRoomCount)} className={field}>
                        {[1, 2, 3].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className={`mt-2 w-full py-3 rounded-lg text-[14px] font-semibold transition-colors ${navy} disabled:bg-slate-300 disabled:cursor-not-allowed`}
                      onClick={handleSearch}
                      disabled={!checkInDate || !checkOutDate}
                    >
                      Search Rooms
                    </button>
                    {(!checkInDate || !checkOutDate) && (
                      <p className="text-[12px] text-slate-500 text-center">Pick check-in and check-out dates to continue</p>
                    )}
                  </div>
                </div>

                {/* Calendar */}
                <div className={`md:col-span-2 ${card} p-5 sm:p-6`}>
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full" aria-label="Previous month">
                      <ChevronLeft size={20} />
                    </button>
                    <div className="text-[15px] font-semibold text-slate-900">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full" aria-label="Next month">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center py-2 text-[12px] font-medium text-slate-400 uppercase">
                        {day}
                      </div>
                    ))}
                    {generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((day, index) => {
                      const past = day !== null && isDateInPast(day, currentMonth.getMonth(), currentMonth.getFullYear());
                      const isEnd = day !== null && (toIso(day) === checkInDate || toIso(day) === checkOutDate);
                      const inRange = day !== null && isDateInRange(day, currentMonth.getMonth(), currentMonth.getFullYear());
                      return (
                        <div
                          key={index}
                          className={`text-center py-2 sm:py-2.5 text-[14px] rounded-lg transition-colors ${
                            day === null
                              ? ''
                              : past
                              ? 'text-slate-300 cursor-not-allowed'
                              : isEnd
                              ? 'bg-[rgb(0,0,115)] text-white font-semibold cursor-pointer'
                              : inRange
                              ? 'bg-orange-100 text-orange-800 cursor-pointer'
                              : 'text-slate-700 cursor-pointer hover:bg-slate-100'
                          }`}
                          onClick={() => {
                            if (day !== null && !past) {
                              handleDateClick(day, currentMonth.getMonth(), currentMonth.getFullYear());
                            }
                          }}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[13px] text-center text-slate-500">
                    Select your dates by clicking on the calendar above
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      ['Check-in', checkInDate ? new Date(checkInDate).toLocaleDateString() : '—'],
                      ['Check-out', checkOutDate ? new Date(checkOutDate).toLocaleDateString() : '—'],
                      ['Nights', checkInDate && checkOutDate ? String(calculateNumberOfNights()) : '0'],
                    ].map(([title, value]) => (
                      <div key={title} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 sm:p-3 text-center">
                        <p className="text-[11px] sm:text-[12px] text-slate-500">{title}</p>
                        <p className="text-[13px] sm:text-[14px] font-semibold text-slate-900 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Room Selection Step */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Select Your Room</h2>
                    <p className="text-slate-500 text-[14px] mt-1">Choose from our luxurious room options</p>
                  </div>
                  <button onClick={() => setActiveStep(1)} className="text-[14px] text-[rgb(0,0,115)] hover:underline flex items-center shrink-0">
                    <ChevronLeft size={16} /> Change dates
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  {roomTypes.map((room, index) => {
                    const isSelected = selectedRoom?.type === room.type;
                    return (
                      <div
                        key={index}
                        className={`${card} overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ${
                          isSelected ? 'ring-2 ring-orange-500 border-transparent' : 'hover:border-slate-300'
                        }`}
                        onClick={() => {
                          setSelectedRoom(room);
                          setSelectedRoomCount(1);
                        }}
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-56 h-48 sm:h-auto relative shrink-0">
                            <img
                              src={room.images[0]}
                              alt={room.type}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="text-[16px] font-semibold text-slate-900">{room.type}</h4>
                                <p className="text-slate-500 mt-1 text-[14px]">Experience luxury and comfort</p>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-[18px] font-bold text-[rgb(0,0,115)]">{room.currency}{room.price}</div>
                                <div className="text-[12px] text-slate-500">per night</div>
                              </div>
                            </div>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <label className="text-[13px] text-slate-600">Rooms</label>
                                <select
                                  value={isSelected ? selectedRoomCount : 1}
                                  onChange={(e) => {
                                    setSelectedRoom(room);
                                    setSelectedRoomCount(parseInt(e.target.value));
                                  }}
                                  className="bg-white text-[14px] text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[rgb(0,0,115)]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {[1, 2, 3].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                  ))}
                                </select>
                                {isSelected && (
                                  <span className="bg-orange-100 text-orange-700 text-[12px] font-medium px-2.5 py-1 rounded-full">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isSelected) {
                                    setSelectedRoom(room);
                                    setSelectedRoomCount(1);
                                  }
                                  setShowPayment(true);
                                  setActiveStep(3);
                                }}
                                className={`${navy} text-[14px] font-semibold px-6 py-2.5 rounded-lg transition-colors`}
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Step */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Payment Details</h2>
                    <p className="text-slate-500 text-[14px] mt-1">Complete your booking with secure payment</p>
                  </div>
                  <button onClick={() => setActiveStep(2)} className="text-[14px] text-[rgb(0,0,115)] hover:underline flex items-center shrink-0">
                    <ChevronLeft size={16} /> Change room
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
                  {/* Booking Summary */}
                  <div className={`${card} p-5 sm:p-6 md:sticky md:top-24`}>
                    <h3 className="text-[15px] font-semibold text-slate-900 mb-4">Booking Summary</h3>
                    <dl className="divide-y divide-slate-100 text-[14px]">
                      {[
                        ['Check-in', checkInDate && new Date(checkInDate).toLocaleDateString()],
                        ['Check-out', checkOutDate && new Date(checkOutDate).toLocaleDateString()],
                        ['Room Type', selectedRoom?.type],
                        ['Room Count', selectedRoomCount],
                        ['Nights', calculateNumberOfNights()],
                        ['Price per Night', `${selectedRoom?.currency} ${selectedRoom?.price}`],
                      ].map(([title, value]) => (
                        <div key={String(title)} className="flex justify-between gap-4 py-2.5">
                          <dt className="text-slate-500">{title}</dt>
                          <dd className="font-medium text-slate-900 text-right">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 rounded-xl bg-orange-50 border border-orange-100 p-4">
                      <p className="text-[13px] text-orange-700">Total Amount</p>
                      <p className="text-[22px] font-bold text-slate-900">{selectedRoom?.currency} {calculateTotalPrice().toFixed(2)}</p>
                      <p className="text-[12px] text-slate-500 mt-1">
                        {selectedRoomCount} {selectedRoomCount === 1 ? 'room' : 'rooms'} × {calculateNumberOfNights()} {calculateNumberOfNights() === 1 ? 'night' : 'nights'} × {selectedRoom?.currency} {selectedRoom?.price}
                      </p>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className={`md:col-span-2 ${card} p-5 sm:p-6`}>
                    <h3 className="text-[15px] font-semibold text-slate-900 mb-4">Guest Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div>
                        <label className={label}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={field} placeholder="Enter your first name" />
                      </div>
                      <div>
                        <label className={label}>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={field} placeholder="Enter your last name" />
                      </div>
                      <div>
                        <label className={label}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="Enter your email" />
                      </div>
                      <div>
                        <label className={label}>Phone</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} placeholder="Enter your phone number" />
                      </div>
                    </div>

                    <h3 className="text-[15px] font-semibold text-slate-900 mb-4">Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {[
                        { id: 'momo', title: 'Mobile Money', desc: 'Pay via Mobile Money transfer' },
                        { id: 'arrival', title: 'Pay on Arrival', desc: 'Pay at the hotel during check-in' },
                      ].map((method) => {
                        const active = selectedPaymentMethod === method.id;
                        return (
                          <label
                            key={method.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                              active ? 'border-[rgb(0,0,115)] bg-[rgb(0,0,115)]/[0.04] ring-1 ring-[rgb(0,0,115)]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={active}
                              onChange={() => handlePaymentMethodChange(method.id)}
                              className="mt-0.5 accent-[rgb(0,0,115)]"
                            />
                            <div>
                              <p className="text-[14px] font-medium text-slate-900">{method.title}</p>
                              <p className="text-[13px] text-slate-500">{method.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {selectedPaymentMethod === 'momo' && (
                      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[14px] text-slate-700 mb-3">
                          Please make payment to: <span className="font-semibold text-slate-900">+233(0)535140377</span>
                        </p>
                        <label className={label}>Upload Payment Proof</label>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="w-full text-[14px] text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[14px] file:font-medium file:bg-[rgb(0,0,115)] file:text-white hover:file:bg-[rgb(0,0,150)] file:cursor-pointer"
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={handleCompleteBooking}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white text-[14px] font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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
              <div className={`${card} flex flex-col items-center justify-center p-6 sm:p-10 max-w-2xl mx-auto`}>
                <div className="mb-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-50 ring-8 ring-green-50/50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-slate-600">Your reservation has been successfully completed.</p>
                </div>

                {feedback?.type === 'success' && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl mb-6 w-full">
                    <h3 className="text-[15px] font-semibold text-slate-900 mb-2">Booking Details</h3>
                    <p className="text-slate-600 text-[14px]">{feedback.message}</p>
                  </div>
                )}

                <div className="w-full space-y-4 text-center">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <p className="text-orange-800 text-[14px]">
                      <span className="font-semibold">Next Steps:</span> You will receive a confirmation email shortly with your booking details.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={() => window.location.reload()}
                      className={`px-6 py-3 rounded-lg font-semibold text-[14px] transition-colors flex items-center justify-center gap-2 ${navy}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      <span>Make Another Booking</span>
                    </button>
                    <a
                      href="/"
                      className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-[14px] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span>Return Home</span>
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 w-full text-center">
                  <h4 className="font-semibold text-slate-900 mb-1">Need Help?</h4>
                  <p className="text-slate-500 text-[14px]">Contact our support team</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mt-3 text-[14px]">
                    <a href="tel:+233535140377" className="text-[rgb(0,0,115)] hover:text-orange-600 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      +233(0)535140377
                    </a>
                    <a href="mailto:info.emsonhotel@gmail.com" className="text-[rgb(0,0,115)] hover:text-orange-600 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email Us
                    </a>
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
