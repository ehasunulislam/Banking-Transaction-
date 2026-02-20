const mongoose = require("mongoose");


async function ConnectedDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected sucessfully");
    }
    catch(err) {
        console.error("Database not connected");
        console.error(err.message);
    }
}

module.exports = ConnectedDB