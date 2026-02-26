const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose")


async function createTransaction(req, res) {
    // 1. validate request

    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || idempotencyKey) {
       return res.status(400).json({
            message: "fromAccount, toAccount, amount and indempotencyKey are required"
        });
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    });

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });

    if(!fromUserAccount || !toUserAccount) {
        return res.status(404).json({
            message: "Invalid fromAccount or toAccount"
        });
    } 
    
    // 2. validate idempotency key

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });

    if(isTransactionAlreadyExists) {
        if(isTransactionAlreadyExists.status === "COMPLETED") {
           return res.status(200).json({
                message: "Transaction already completed",
                transaction: isTransactionAlreadyExists,
            }); 
        }

        if(isTransactionAlreadyExists.status === "PENDING") {
           return res.status(202).json({
                message: "Transaction is still processing",
            }); 
        }

        if(isTransactionAlreadyExists.status === "FAILED") {
           return res.status(500).json({
                message: "Transaction already failed, please retry",
            }); 
        }

        if(isTransactionAlreadyExists.status === "REVERSED") {
           return res.status(500).json({
                message: "Transaction already reversed, please retry",
            }); 
        }
    }

    // 3. check acount status

    if(!fromUserAccount.status !== "ACTIVE" || !toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be active to process the transaction",
        });
    }

    // 4. Derive sender balance from ledger

    const balance = await fromUserAccount.getBalance()    /* getBalance is a mehtod which is comes from acocunt.model.js */

    if(balance < amount) {
       return res.status(400).json({
            message: `Insufficient balance. Your current balance is ${balance}. Required balance is ${amount}`,
        })
    } 

    // 5. create transaction with pending status

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    }, {session})  
    
    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    } , {session})

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    } , {session})

    transaction.status = "COMPLETED",
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()


    // 6. send email notification

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, fromAccount, toAccount);

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction,
    })
};


module.exports = {
    createTransaction,
}