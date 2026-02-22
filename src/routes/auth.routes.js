const express = require("express");

const router = express.Router();

/* controllers require */
const authController = require("../controllers/auth.controllers");


/* register api start */
// ** post /api/auth/register **
router.post("/register", authController.userRegisterController)
/* register api end */


/* login api start */
// ** post /api/auth/login **
router.post("/login", authController.userLoginController)
/* login api end */


module.exports = router