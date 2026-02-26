const mongoose = require("mongoose");


const transactionScema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with a from account"],
        index: true,
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with a to account"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED",
        },
        default: "PENDING",
    },
    amount:  {
        type: Number,
        required: [true, "Transaction amount is required"],
        min: [0, "Transaction amount can not be negative"],
    },
    idempotencyKey: {
        type: String,
        required: [true, "Indempotency key is required"],
        index: true,
        unique: true,
    },
}, {
    timestamps: true,
})


const transactionModel = mongoose.model("transaction", transactionScema);

module.exports = transactionModel;