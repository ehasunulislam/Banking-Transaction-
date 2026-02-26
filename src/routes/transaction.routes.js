const express = require("express");


const router = express.Router();

const authMiddleWare = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");



router.post("/", authMiddleWare.authMiddleWare, transactionController.createTransaction)

module.exports = router;