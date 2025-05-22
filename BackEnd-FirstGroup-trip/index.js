const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv"); 


dotenv.config();

const authRoutes = require("./routes/authRoutes");

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
  })
);

app.use(express.json()); 

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行在埠號 ${PORT}`);
});
