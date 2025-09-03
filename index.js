const express = require("express");
const pool = require("./db");
const cors = require("cors");
const userRoute= require("./routes/userRoute.js")
const driverRoute=require("./routes/driverRoute.js")

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use("/users", userRoute);
app.use("/drivers", driverRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
