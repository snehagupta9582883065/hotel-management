const db = require('../db');

exports.getDashboardData = async (req, res) => {
    try {
        // 1. Fetch KPI Stats
        // Today's Revenue
        const [revenueResult] = await db.query(`
            SELECT COALESCE(SUM(total_amount), 0) as today_revenue 
            FROM bookings 
            WHERE DATE(created_at) = CURDATE() AND status != 'Canceled'
        `);

        // Occupied Rooms & Total Rooms
        const [occupancyResult] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM rooms WHERE status = 'Occupied') as occupied_count,
                (SELECT COUNT(*) FROM rooms) as total_rooms
        `);
        const { occupied_count, total_rooms } = occupancyResult[0];
        const occupancy_percentage = total_rooms > 0 ? ((occupied_count / total_rooms) * 100).toFixed(1) : 0;

        // Check-ins
        const [checkinsResult] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'Checked-in' THEN 1 ELSE 0 END) as completed
            FROM bookings 
            WHERE check_in_date = CURDATE() AND status IN ('Pending', 'Confirmed', 'Checked-in')
        `);

        // Check-outs
        const [checkoutsResult] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Checked-in' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'Checked-out' THEN 1 ELSE 0 END) as completed
            FROM bookings 
            WHERE check_out_date = CURDATE() AND status IN ('Checked-in', 'Checked-out')
        `);

        // Available Rooms (Calculated)
        const available_rooms = total_rooms - occupied_count;

        const kpiStats = {
            today_revenue: {
                value: parseFloat(revenueResult[0].today_revenue),
                currency: "USD",
                trend_percentage: 8.5, // Placeholder for trend
                trend_direction: "up"
            },
            occupied_rooms: {
                value: occupied_count,
                total: total_rooms,
                percentage: parseFloat(occupancy_percentage),
                trend_percentage: 12.0,
                trend_direction: "up"
            },
            total_rooms: {
                value: total_rooms
            },
            available_rooms: {
                value: available_rooms
            },
            check_ins: {
                today_total: checkinsResult[0].total,
                pending: checkinsResult[0].pending,
                completed: checkinsResult[0].completed
            },
            check_outs: {
                today_total: checkoutsResult[0].total,
                pending: checkoutsResult[0].pending,
                completed: checkoutsResult[0].completed
            }
        };

        // 2. Fetch Revenue Chart Data (Last 7 Days)
        const [revenueChartResult] = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, '%b %e') as date, 
                SUM(total_amount) as revenue, 
                COUNT(*) as bookings_count 
            FROM bookings 
            WHERE created_at >= DATE(NOW()) - INTERVAL 7 DAY 
            GROUP BY DATE_FORMAT(created_at, '%b %e')
            ORDER BY MIN(created_at) ASC
        `);
        const revenueChartData = revenueChartResult.map(row => ({
            date: row.date,
            revenue: parseFloat(row.revenue),
            bookings_count: row.bookings_count
        }));

        // 3. Fetch Room Status Overview
        const [roomStatusResult] = await db.query(`
            SELECT 
                r.room_id,
                r.room_number,
                rt.name as room_type,
                r.status,
                g.guest_id,
                CONCAT(g.first_name, ' ', g.last_name) as guest_name
            FROM rooms r
            JOIN room_types rt ON r.type_id = rt.type_id
            LEFT JOIN bookings b ON r.room_id = b.room_id AND b.status = 'Checked-in'
            LEFT JOIN guests g ON b.guest_id = g.guest_id
            ORDER BY r.room_number
        `);

        const roomStatusOverview = roomStatusResult.map(room => ({
            room_id: room.room_id,
            room_number: room.room_number,
            room_type: room.room_type,
            status: room.status.toLowerCase(),
            current_guest: room.guest_id ? {
                guest_id: room.guest_id,
                name: room.guest_name
            } : null
        }));

        // 4. Fetch Occupancy Breakdown
        const [breakdownResult] = await db.query(`
            SELECT status, COUNT(*) as count 
            FROM rooms 
            GROUP BY status
        `);

        const breakdownObj = { available: 0, occupied: 0, cleaning: 0, maintenance: 0 };
        breakdownResult.forEach(row => {
            const key = row.status.toLowerCase();
            if (breakdownObj.hasOwnProperty(key)) {
                breakdownObj[key] = row.count;
            }
        });

        res.json({
            status: "success",
            data: {
                kpi_stats: kpiStats,
                revenue_chart_data: revenueChartData,
                room_status_overview: roomStatusOverview,
                occupancy_breakdown: breakdownObj
            },
            meta: {
                timestamp: new Date().toISOString(),
                version: "1.0"
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
