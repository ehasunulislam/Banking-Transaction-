const express = require("express");

const authRouter = require("./routes/auth.routes")


const app = express();

app.use(express.json())


/* api creation start */
app.use("/api/auth", authRouter)
/* api creation end */

module.exports = app;