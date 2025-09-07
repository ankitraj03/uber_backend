// routes/geocodeRoute.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/geocode", async (req, res) => {
  try {
    const { place } = req.query;

    if (!place) {
      return res.status(400).json({ error: "Place is required" });
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      place
    )}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "RideShareApp/1.0 (bhaugaitonde7352@gmail.com)", // Nominatim requires a valid UA
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Geocode error:", err.message);
    res.status(500).json({ error: "Failed to fetch geocode" });
  }
});




module.exports = router;
