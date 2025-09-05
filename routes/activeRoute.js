const express= require("express");
const pool = require('../db');

const router = express.Router();

router.post('/active', async (req, res)=>{
    try{
        const {id, latitude, longitude, vtype}= req.body;
        const result = await pool.query(
            "INSERT INTO active_drivers (id, latitude, longitude, vtype) VALUES ($1,$2,$3,$4) RETURNING *",
            [id, latitude, longitude, vtype]
        );
        res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

router.post('/inactive', async (req, res)=>{
    try{
        const {id}= req.body;
        const result= await pool.query(
            "DELETE FROM active_drivers WHERE id = $1", [id]
        );
        res.json("Inactive status");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})


router.post("/get", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const R = 6371; 

    const result = await pool.query(
      `
      SELECT id, latitude, longitude, vtype,
        (
          ${R} * acos(
            cos(radians($1)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(latitude))
          )
        ) AS distance
      FROM active_drivers
      WHERE (
        ${R} * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )
      ) <= 5
      ORDER BY distance ASC
      `,
      [latitude, longitude]
    );

    res.json(result.rows); // always returns array
  } catch (err) {
    console.error("Error in fetching active drivers:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;