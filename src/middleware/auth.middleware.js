const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authMiddleWare(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];

    if(!token) {
        return res.status(401).json({
            message: "unauthorize token, token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.jwt_secret);

        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        return next()
    }
    catch(err) {
        return res.status(401).json({
            message: "unauthorize token, token is invalid"
        })
    }
}

module.exports = { authMiddleWare }