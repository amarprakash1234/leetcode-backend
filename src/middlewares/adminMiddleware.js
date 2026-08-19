const User = require("../models/user");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error("Token is not persent");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const {_id} = payload;
        if(!_id) {
            throw new Error("Invalid Token");
        }

        if(payload.role != "admin") {
            throw new Error("Invalid Token");
        }

        const result = await User.findById(_id);
        if(!result) {
            throw new Error("User doesn't exist");
        }

        // Redis ke blocklist me khi token persent to nhi
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked) {
            throw new Error("Invalid Token");
        }
        req.result = result;
        next();
    } catch(err) {
        res.status(401).send(`Error -> ${err.message}`);
    }
}   

module.exports = adminMiddleware;

