const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const {userRoutes} = require('./routes/userRoutes')


const app = express();
dotEnv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.json({
    message: "API's are working fine",
  });
});

userRoutes(app);

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error1) => {
      console.log("DB connection failed", error1);
    });
  console.log(`Server is running on ${process.env.port}`);
});
