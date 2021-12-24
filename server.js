const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const app = express();

app.use(express.json({ extended: false }));
app.use(morgan("combined"));

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  });

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/ships", require("./routes/ships"));
app.use("/api/positions", require("./routes/positions"));
app.use("/api/sections", require("./routes/sections"));

app.listen(process.env.PORT, () => {
  console.log(`SERVER WORKING AT ${process.env.PORT}`);
});
