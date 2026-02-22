const userModel = require("../models/user.model");


/* 
* - user register cont6roller
* - post =>  /api/auth/register
*/

async function userRegisterController(req, res) {
    const {email, name, password} = req.body;

    const existingUser = await userModel.findOne({
        email: email
    });

    if(existingUser) {
        return res.status(422).json({
            message: "user already exists with email"
        })
    }
}

module.exports = {userRegisterController}