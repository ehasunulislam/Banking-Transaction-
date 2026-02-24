const mongoose = require("mongoose");


const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be assiociated with the user"],
        index: true,
    },
    status: {
        enum: {
            value: ["ACTIVE", "FROZEN", "CLOSE"],
            message: "Status can be either ACTIVE, FROZEN or CLOSE"
        }
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

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel