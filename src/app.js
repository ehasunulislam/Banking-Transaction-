const express = require("express");
const cookieParser = require("cookie-parser")

const app = express();


const authRouter = require("./routes/auth.routes");


app.use(express.json());
app.use(cookieParser());


/* api creation start */
app.use("/api/auth", authRouter)
/* api creation end */

module.exports = app;