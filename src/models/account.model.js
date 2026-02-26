const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");


const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Account must be assiociated with the user"],
        index: true,
    },
    userName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSE"],
            message: "Status can be either ACTIVE, FROZEN or CLOSE"
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency must be required"],
        default: "BDT"
    }
}, {
    timestamps: true
});

accountSchema.index({ user: 1, status: 1 });

// create a method
accountSchema.methods.getBalance = async function() {
    const balaceData = await ledgerModel.aggregate([
        {
            $match: {account: this._id},
        },
        {
            $group: {
               _id: null,
               totalDebit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$type", "DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
               },
                totalCredit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$type", "CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
               }
            }
        },
        {
             $project:  {
                _id: 0,
                balance: {$subtract: ["$totalCredit", "$totalDebit"]}
            }
        }
    ])


    if(balaceData.length === 0 ){
        return 0;
    }

    return balanceData[0].balance
}

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel