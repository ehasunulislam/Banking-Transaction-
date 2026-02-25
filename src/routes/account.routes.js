const express = require("express");

const router = express.Router();

const authMiddleWare = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller")



/*
* - POST -> api/accounts
* - Create a new account
* - Protected route 
*/
router.post("/", authMiddleWare.authMiddleWare, accountController.createAccountController)







module.exports = router