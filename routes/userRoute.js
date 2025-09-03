const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, email, phone, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/get", async(req,res)=>{
    const {email, password}= req.body;
    try{
        const result= await pool.query(
            "SELECT * from users WHERE email=$1 AND password=$2",
            [email, password]
        )
        if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    res.json(result.rows[0])
    }
    catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})


module.exports = router;