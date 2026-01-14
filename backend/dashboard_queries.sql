-- Dashboard SQL Queries
-- These queries map directly to the JSON structure required by the Dashboard API

-- 1. KPI Stats: Today's Revenue
SELECT SUM(total_amount) as today_revenue 
FROM bookings 
WHERE DATE(created_at) = CURDATE() AND status != 'Canceled';

-- 2. KPI Stats: Occupied Rooms Count & Percentage
SELECT 
    (SELECT COUNT(*) FROM rooms WHERE status = 'Occupied') as occupied_count,
    (SELECT COUNT(*) FROM rooms) as total_rooms,
    ((SELECT COUNT(*) FROM rooms WHERE status = 'Occupied') / (SELECT COUNT(*) FROM rooms) * 100) as occupancy_percentage;

-- 3. KPI Stats: Room Status Counts (Available, Cleaning, Maintenance, etc.)
SELECT status, COUNT(*) as count 
FROM rooms 
GROUP BY status;

-- 4. KPI Stats: Today's Check-ins
SELECT COUNT(*) as today_checkins 
FROM bookings 
WHERE check_in_date = CURDATE() AND status IN ('Confirmed', 'Checked-in');

-- 5. KPI Stats: Today's Check-outs
SELECT COUNT(*) as today_checkouts 
FROM bookings 
WHERE check_out_date = CURDATE() AND status IN ('Checked-in', 'Checked-out');

-- 6. Revenue Chart Data (Last 7 Days)
SELECT 
    DATE(created_at) as date, 
    SUM(total_amount) as revenue, 
    COUNT(*) as bookings_count 
FROM bookings 
WHERE created_at >= DATE(NOW()) - INTERVAL 7 DAY 
GROUP BY DATE(created_at) 
ORDER BY date ASC;

-- 7. Room Status Overview (List with Guest Details)
-- Joins Rooms, Room Types, Bookings, and Guests to show current room status
SELECT 
    r.room_id,
    r.room_number,
    rt.name as room_type,
    r.status,
    g.guest_id,
    CONCAT(g.first_name, ' ', g.last_name) as guest_name
FROM rooms r
JOIN room_types rt ON r.type_id = rt.type_id
LEFT JOIN bookings b ON r.room_id = b.room_id AND b.status = 'Checked-in' -- Only get active check-ins
LEFT JOIN guests g ON b.guest_id = g.guest_id
ORDER BY r.room_number;
