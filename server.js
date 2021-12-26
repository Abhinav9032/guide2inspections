const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
app.use(express.json({ extended: false }));
app.use(morgan("combined"));
//const dbUrl = 'mongodb+srv://mongo-man:Genvision159!@cluster0.t79w5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

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

app.get("/hello/aws", (req, res) => {
  res.json({ message: "Ths is from aws deployment code pipeline testing" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`SERVER WORKING AT ${PORT}`);
});
