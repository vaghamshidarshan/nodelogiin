const express = require("express");
const mssql = require("mssql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  server: "192.168.200.11",
  user: "sa",
  password: "Parivar@2022!",
  database: "testt",
  options: {
    encrypt: false,
  },
};

const pool = new mssql.ConnectionPool(dbConfig);

pool
  .connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.stack);
    process.exit(1); // Gracefully exit the application on connection failure
  });

app.post("/login", async (req, res) => {
  try {
    const request = pool.request();
    request.input("email", mssql.VarChar, req.body.email);
    request.input("password", mssql.VarChar, req.body.password);

    const result = await request.query(
      `SELECT * FROM login WHERE email = @email AND password = @password`
    );

    if (result.recordset.length > 0) {
      res.json({ message: "Login Success" });
    } else {
      res.status(401).json({ message: "Invalid credentials" }); // Use appropriate HTTP status code for invalid credentials
    }
  } catch (err) {
    console.error("SQL query error:", err.stack);
    res.status(500).json({ message: "Internal server error" }); // Use appropriate HTTP status code for server errors
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
