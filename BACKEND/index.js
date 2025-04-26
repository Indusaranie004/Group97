require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const CashRoutes = require("./Routes/CashLog_Route");
const FMSignUp_Route = require("./Routes/FMSignUp_Route")
const FMSignIn_Route = require('./Routes/FMLogin_Route');
const Assets_Route = require('./Routes/Liabilities_Route');

const app = express();
const cors = require("cors");

// Middleware

app.use(express.json());
app.use(cors());
app.use("/CashLog",CashRoutes);
app.use("/FinMngSignUp",FMSignUp_Route);
app.use("/FinMngSignIn",FMSignIn_Route);
app.use("/Assets",Assets_Route);


mongoose.connect("mongodb+srv://Indusaranie:Group97Y2S2@fitnesspro.h0hzx.mongodb.net/test")
  .then(() => {
      console.log("Connected to MongoDB");
      app.listen(5001, () => console.log("Server running on port 5001"));
  })
  .catch(err => console.log(err));