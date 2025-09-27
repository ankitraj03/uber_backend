const express = require("express");
const router = express.Router();
const pool = require("../db");
const { broadcast } = require("./eventsRoute.js"); // ⬅ import broadcast

router.post("/rides", async (req, res) => {
  try {
    const { rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng, fare } = req.body;
    const status = "Pending";

    const result = await pool.query(
      `INSERT INTO rides (rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng, status, fare)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng, status, fare]
    );

    const newRide = result.rows[0];

    // 🔹 Broadcast new ride to all connected drivers via SSE
    broadcast({
      type: "NEW_RIDE",
      ride: newRide
    });

    res.status(201).json(newRide);
  } catch (err) {
    console.error("Error creating ride:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
