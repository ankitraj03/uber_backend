const {Pool}= require("pg")

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"uber",
    password:"Ankit@1234",
    port:"5432"
})

pool.connect()
  .then(() => console.log(" Connected to PostgreSQL"))
  .catch(err => console.error("Connection error", err.stack));

module.exports = pool;