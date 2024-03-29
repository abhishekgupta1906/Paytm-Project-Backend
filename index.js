const express = require("express");
const rootRouter = require("./routes/index");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const JWT = require("jsonwebtoken");
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
app.use("/api/v1", rootRouter);

app.get('/',(req,res) =>{
  res.json({
    message:"hello the paytm server"
  })
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
