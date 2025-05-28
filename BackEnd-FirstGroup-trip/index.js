const express = require("express");
const cors = require("cors");
const emailPreferencesRoute = require("./src/routes/emailPreferencesRoute");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/email-preferences", emailPreferencesRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
