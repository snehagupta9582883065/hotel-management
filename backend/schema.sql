-- Database Schema for Hotel Management System

CREATE DATABASE IF NOT EXISTS HM;
USE HM;

-- 1. Guests Table
-- Stores guest information for the Guest List page and booking associations
CREATE TABLE guests (
    guest_id VARCHAR(20) PRIMARY KEY, -- e.g., 'G001'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20) NOT NULL,
    nationality VARCHAR(50),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    id_type ENUM('Passport', 'National ID', 'Driver License') NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Room Types Table
-- Defines categories of rooms (Standard, Deluxe, Suite, etc.)
CREATE TABLE room_types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- 'Standard', 'Deluxe', 'Suite'
    base_price DECIMAL(10, 2) NOT NULL,
    max_occupancy INT NOT NULL,
    description TEXT
);

-- 3. Rooms Table
-- Stores individual room details for Room Management page
CREATE TABLE rooms (
    room_id INT PRIMARY KEY, -- Room Number e.g., 101, 102
    room_number VARCHAR(10) NOT NULL UNIQUE,
    type_id INT NOT NULL,
    floor_number INT NOT NULL,
    status ENUM('Available', 'Occupied', 'Cleaning', 'Maintenance') DEFAULT 'Available',
    FOREIGN KEY (type_id) REFERENCES room_types(type_id)
);

-- 4. Bookings Table
-- Central table linking Guests and Rooms. Critical for Dashboard stats.
CREATE TABLE bookings (
    booking_id VARCHAR(20) PRIMARY KEY, -- e.g., 'BK001'
    guest_id VARCHAR(20) NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_adults INT DEFAULT 1,
    num_children INT DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Canceled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(guest_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- 5. Payments Table (Optional but recommended for Revenue tracking)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('Cash', 'Credit Card', 'Online Transfer'),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);
