-- Create custom enum types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_status') THEN
        CREATE TYPE room_status AS ENUM ('available', 'booked', 'maintenance');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
        CREATE TYPE availability_status AS ENUM ('available', 'booked', 'blocked');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'staff');
    END IF;
END $$;

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_type VARCHAR(50) NOT NULL,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    capacity_adults INTEGER DEFAULT 1,
    capacity_children INTEGER DEFAULT 0,
    status room_status DEFAULT 'available'
);

-- Clear existing data before inserting
DELETE FROM rooms;

-- Insert Sample Rooms
INSERT INTO rooms (room_type, room_number, price, description, image_url, capacity_adults, capacity_children, status) VALUES
('Standard Room', 'STD-101', 3000.00, 'Comfortable room with modern amenities', 'standard-room.jpg', 2, 1, 'available'),
('Executive Room', 'EXE-201', 7500.00, 'Spacious room with premium amenities', 'executive-room.jpg', 2, 2, 'available'),
('Superior Room', 'SUP-301', 4200.00, 'Enhanced comfort with extra features', 'superior-room.jpg', 2, 1, 'available')
ON CONFLICT (room_number) DO NOTHING;

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_status booking_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Availability Table
CREATE TABLE IF NOT EXISTS room_availability (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) NOT NULL,
    date DATE NOT NULL,
    status availability_status DEFAULT 'available',
    price_override DECIMAL(10, 2),
    UNIQUE(room_id, date)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing admin users
DELETE FROM users WHERE username = 'admin';

-- Insert Admin User (with hashed password)
-- Note: In a real application, use a proper password hashing method
INSERT INTO users (username, password_hash, role) VALUES 
('admin', 'pbkdf2:sha256:260000$randomsalt$hashedpassword', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for performance
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_bookings_room_id') THEN
        CREATE INDEX idx_bookings_room_id ON bookings(room_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_bookings_dates') THEN
        CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_room_availability_room_id') THEN
        CREATE INDEX idx_room_availability_room_id ON room_availability(room_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_room_availability_date') THEN
        CREATE INDEX idx_room_availability_date ON room_availability(date);
    END IF;
END $$;
