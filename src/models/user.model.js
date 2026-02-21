const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
            "Invalid Email Address"
        ],
        unique: [true, "Email is already exist"]
    },

    name: {
        type: String,
        required: [true, "Name is required for creating an account"],
    },

    password: {
        type: String,
        required: [true, "password is required for creating an account"],
        minlength: [6, "password should be in 6 character"],
        select: false,

    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash

    return next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}