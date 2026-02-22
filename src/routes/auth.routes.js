const express = require("express");

const router = express.Router();

/* controllers require */
const authController = require("../controllers/auth.controllers");


/* register api start */
// ** post /api/auth/register **
router.post("/register", authController.userRegisterController)
/* register api end */





module.exports = router