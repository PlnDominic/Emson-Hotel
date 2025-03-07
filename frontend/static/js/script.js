// Calendar class definition
class Calendar {
    constructor() {
        this.currentDate = new Date(2025, 0); // January 2025
        this.startDate = null;
        this.endDate = null;
        this.selectedHotel = null;
        this.selectedRooms = 1;
        this.selectedAdults = 0;
        this.selectedChildren = 0;
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Room data
        this.roomTypes = {
            standard: {
                name: 'Standard Single',
                price: 220.00,
                image: '/static/img/standard deluxe.jpg',
                description: 'Comfortable room with modern amenities'
            },
            executive: {
                name: 'Standard Deluxe',
                price: 250.00,
                image: '/static/img/pent.jpg',
                description: 'Luxurious room with premium amenities'
            },
            superior: {
                name: 'The Executive',
                price: 250.00,
                image: '/static/img/single.jpg',
                description: 'Enhanced comfort with extra features'
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.generateCalendars();
        this.updateDateRangeDisplay();
    }

    setupEventListeners() {
        // Hotel selection
        const hotelSelect = document.getElementById('hotel-select');
        if (hotelSelect) {
            hotelSelect.addEventListener('change', (e) => {
                this.selectedHotel = e.target.value;
                this.validateSelection();
            });
        }

        // Room selection
        const roomSelect = document.getElementById('room-select');
        if (roomSelect) {
            roomSelect.addEventListener('change', (e) => {
                this.selectedRooms = parseInt(e.target.value);
                this.validateSelection();
            });
        }

        // Adult selection
        const adultSelect = document.getElementById('adult-select');
        if (adultSelect) {
            adultSelect.addEventListener('change', (e) => {
                this.selectedAdults = parseInt(e.target.value);
                this.validateSelection();
            });
        }

        // Child selection
        const childSelect = document.getElementById('child-select');
        if (childSelect) {
            childSelect.addEventListener('change', (e) => {
                this.selectedChildren = parseInt(e.target.value);
                this.validateSelection();
            });
        }

        // Search button
        const searchBtn = document.getElementById('search-button');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.showAvailableRooms());
        }

        // Calendar navigation
        const prevButton = document.querySelector('.prev-month');
        const nextButton = document.querySelector('.next-month');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.generateCalendars();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.generateCalendars();
            });
        }
    }

    validateSelection() {
        const searchBtn = document.getElementById('search-button');
        if (searchBtn) {
            const isValid = this.selectedHotel && this.selectedRooms > 0 && 
                          this.selectedAdults >= 0 && this.selectedChildren >= 0 && this.startDate && this.endDate;
            searchBtn.disabled = !isValid;
            searchBtn.style.opacity = isValid ? '1' : '0.5';
        }
    }

    showAvailableRooms() {
        // Validate inputs
        if (this.selectedAdults < 1) {
            console.error('At least one adult must be present for booking.');
            return;
        }

        if (this.selectedChildren < 0) {
            console.error('Number of children must be non-negative.');
            return;
        }

        // Validate that startDate and endDate are valid dates before making the API call
        if (!(this.startDate instanceof Date) || isNaN(this.startDate)) {
            console.error('Invalid check-in date.');
            return;
        }

        if (!(this.endDate instanceof Date) || isNaN(this.endDate)) {
            console.error('Invalid check-out date.');
            return;
        }

        if (this.startDate >= this.endDate) {
            console.error('Check-out date must be after check-in date.');
            return;
        }

        // Adjust check-in date if it's today or in the past
        const today = new Date();
        if (this.startDate <= today) {
            this.startDate.setDate(today.getDate() + 1);
            console.log('Check-in date adjusted to tomorrow:', this.startDate);
        }

        // Hide the booking container
        const bookingContainer = document.querySelector('.booking-container');
        if (bookingContainer) {
            bookingContainer.style.display = 'none';
        }

        // Create and show the rooms container
        let roomsContainer = document.querySelector('.rooms-selection-container');
        if (!roomsContainer) {
            roomsContainer = document.createElement('div');
            roomsContainer.className = 'rooms-selection-container';
            bookingContainer.parentNode.insertBefore(roomsContainer, bookingContainer.nextSibling);
        }

        // Create reservation summary
        const reservationSummary = document.createElement('div');
        reservationSummary.className = 'reservation-summary';
        reservationSummary.innerHTML = `
            <h2>Your Reservation</h2>
            <p>Check in: ${this.formatDate(this.startDate)}</p>
            <p>Check out: ${this.formatDate(this.endDate)}</p>
            <p>Room: ${this.selectedRooms} room(s)</p>
            <p>Guests: ${this.selectedAdults} Adult(s)${this.selectedChildren > 0 ? `, ${this.selectedChildren} Child(ren)` : ''}</p>
            <button class="edit-reservation">Edit Room & Guest Quantity</button>
        `;

        // Create loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<p>Searching for available rooms...</p>';
        roomsContainer.appendChild(loadingDiv);

        // Fetch available rooms from the server
        const params = new URLSearchParams({
            checkIn: this.startDate.toISOString().split('T')[0],
            checkOut: this.endDate.toISOString().split('T')[0],
            adults: this.selectedAdults.toString(),
            children: this.selectedChildren.toString()
        });

        console.log('Check-in:', this.startDate);
        console.log('Check-out:', this.endDate);
        console.log('Adults:', this.selectedAdults);
        console.log('Children:', this.selectedChildren);
        console.log('Params:', params.toString());

        fetch(`/api/rooms/available?${params}`)
            .then(response => {
                if (!response.ok) {
                    // Log the response status and status text for debugging
                    console.error('Error fetching rooms: ', response.status, response.statusText);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Log the response data
                // Remove loading indicator
                loadingDiv.remove();

                // Create rooms grid
                const roomsGrid = document.createElement('div');
                roomsGrid.className = 'rooms-grid';

                if (data.length === 0) {
                    roomsGrid.innerHTML = `
                        <div class="no-rooms">
                            <h3>No rooms available</h3>
                            <p>Sorry, there are no rooms available for your selected dates and guest count.</p>
                        </div>
                    `;
                } else {
                    // Add each available room
                    data.forEach(room => {
                        const roomCard = document.createElement('div');
                        roomCard.className = 'room-card';
                        roomCard.innerHTML = `
                            <img src="${room.image_url}" alt="${room.room_type}">
                            <div class="room-info">
                                <h3>${room.room_type}</h3>
                                <p>${room.description}</p>
                                <div class="price">Price GH₵${room.price.toFixed(2)}</div>
                                <a href="#" class="price-breakdown">View Price Breakdown</a>
                                <button class="select-room">Select Room</button>
                            </div>
                        `;

                        // Add click handler for room selection
                        const selectButton = roomCard.querySelector('.select-room');
                        selectButton.addEventListener('click', () => this.selectRoom(room));

                        roomsGrid.appendChild(roomCard);
                    });
                }

                // Update the container
                roomsContainer.innerHTML = '';
                roomsContainer.appendChild(reservationSummary);
                roomsContainer.appendChild(roomsGrid);

                // Add event listener to edit button
                const editButton = roomsContainer.querySelector('.edit-reservation');
                editButton.addEventListener('click', () => {
                    roomsContainer.style.display = 'none';
                    bookingContainer.style.display = 'flex';
                });

                // Example logic to check room availability
                const isAvailable = checkRoomAvailability();
                console.log('Room availability checked:', isAvailable);
                this.updateRoomAvailability(isAvailable);
            })
            .catch(error => console.error('Error fetching rooms:', error));
    }

    selectRoom(room) {
        // Prepare booking data
        const bookingData = {
            room_id: room.id,
            check_in: this.startDate.toISOString().split('T')[0],
            check_out: this.endDate.toISOString().split('T')[0],
            guest_name: '', // Will be collected in payment form
            guest_email: '', // Will be collected in payment form
            number_of_guests: this.selectedAdults + this.selectedChildren,
            total_price: room.price * this.calculateNights()
        };

        // Store booking data for payment page
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Update the booking steps
        const steps = document.querySelectorAll('.step');
        if (steps.length >= 3) {
            steps[1].classList.remove('active');
            steps[2].classList.add('active');
        }

        // Redirect to payment page or show payment form
        // This will be implemented in the next step
        console.log('Selected room:', room);
        console.log('Booking data:', bookingData);
    }

    generateCalendars() {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;

        // Clear existing calendars
        calendarGrid.innerHTML = '';

        // Generate two months
        const currentMonth = this.generateMonth(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth()
        );

        let nextMonth = new Date(this.currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthCalendar = this.generateMonth(
            nextMonth.getFullYear(),
            nextMonth.getMonth()
        );

        calendarGrid.appendChild(currentMonth);
        calendarGrid.appendChild(nextMonthCalendar);

        // Update month titles
        const titleSpans = document.querySelectorAll('.calendar-title span');
        if (titleSpans.length === 2) {
            titleSpans[0].textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
            titleSpans[1].textContent = `${this.monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
        }
    }

    generateMonth(year, month) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'calendar';

        // Add weekday headers
        const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        const weekdaysDiv = document.createElement('div');
        weekdaysDiv.className = 'weekdays';
        weekdays.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            weekdaysDiv.appendChild(dayDiv);
        });
        monthDiv.appendChild(weekdaysDiv);

        // Generate days
        const daysDiv = document.createElement('div');
        daysDiv.className = 'days';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            daysDiv.appendChild(emptyDiv);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = day;

            const currentDate = new Date(year, month, day);
            if (this.startDate && this.endDate) {
                if (currentDate >= this.startDate && currentDate <= this.endDate) {
                    dayDiv.classList.add('selected');
                }
            } else if (this.startDate && currentDate.getTime() === this.startDate.getTime()) {
                dayDiv.classList.add('selected');
            }

            dayDiv.addEventListener('click', () => this.selectDate(year, month, day));
            daysDiv.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysDiv);
        return monthDiv;
    }

    selectDate(year, month, day) {
        const selectedDate = new Date(year, month, day);
        
        if (!this.startDate || (this.startDate && this.endDate)) {
            // Start new selection
            this.startDate = selectedDate;
            this.endDate = null;
        } else {
            // Complete the range
            if (selectedDate < this.startDate) {
                this.endDate = this.startDate;
                this.startDate = selectedDate;
            } else {
                this.endDate = selectedDate;
            }
        }

        this.generateCalendars();
        this.updateDateRangeDisplay();
        this.validateSelection();
    }

    calculateNights() {
        if (!this.startDate || !this.endDate) return 0;
        const timeDiff = this.endDate.getTime() - this.startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    updateDateRangeDisplay() {
        const dateRangeElement = document.querySelector('.date-range-display');
        if (!dateRangeElement) return;

        if (this.startDate && this.endDate) {
            const nights = this.calculateNights();
            const startDateStr = this.formatDate(this.startDate);
            const endDateStr = this.formatDate(this.endDate);
            dateRangeElement.innerHTML = `
                <div style="color: white;">
                    <div>Check-in: ${startDateStr}</div>
                    <div>Check-out: ${endDateStr}</div>
                    <div>Number of nights: ${nights}</div>
                </div>
            `;
        } else if (this.startDate) {
            dateRangeElement.innerHTML = `
                <div style="color: white;">
                    <div>Check-in: ${this.formatDate(this.startDate)}</div>
                    <div>Please select check-out date</div>
                </div>
            `;
        } else {
            dateRangeElement.innerHTML = '<div style="color: white;">Please select your dates</div>';
        }
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateRoomAvailability(isAvailable) {
        const messageElement = document.getElementById('no-rooms-message');
        if (!isAvailable) {
            messageElement.style.display = 'block';
        } else {
            messageElement.style.display = 'none';
        }
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    if (document.querySelector('.calendar-grid')) {
        const calendar = new Calendar();
        calendar.init();
    }
});

// Example function to check room availability
function checkRoomAvailability() {
    // Replace with actual logic to check room availability
    return true;
}
