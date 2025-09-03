const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const result = await pool.query(
      "INSERT INTO drivers (name, email, phone, password) VALUES ($1,$2,$3,$4) RETURNING *",
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
            "SELECT * from drivers WHERE email=$1 AND password=$2",
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

router.post("/insert", async (req, res) => {
  try {
    const { email, vehicle, vtype, vnumber, identity } = req.body;
    const checkUser = await pool.query(
      "SELECT * FROM drivers WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      const result = await pool.query(
        `UPDATE drivers 
         SET vehicle = $1, vtype = $2, vnumber = $3, identity = $4
         WHERE email = $5 
         RETURNING *`,
        [vehicle, vtype, vnumber, identity, email]
      );

      return res.json({ message: "Driver info updated", driver: result.rows[0] });
    } 
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;