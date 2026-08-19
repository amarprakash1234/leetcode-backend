const User = require("../models/user");
const Submission = require("../models/submission");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const register = async (req, res) => {
    try {
        // Ham pehle server side validation krenge.
        validate(req.body);
        //console.log(req.body);
        const {firstName, emailId, password} = req.body;
        // We can check ye emailId khi already exist to nhi krti DB me, but eski jrurt nhi yha.
        // const check = await User.exists({emailId});

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "user";
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, emailId:emailId, role:"user"}, process.env.JWT_KEY, {expiresIn: 3600}); // yha await nhi aata
        // console.log(process.env.JWT_KEY);
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        }
        res.cookie("token", token, {maxAge: 60*60*1000});
        res.status(201).json({
            user: reply,
            message: "Logged in Successfully"
        })

    } catch(err) {
        console.log(err);
        res.status(400).send(`Error -> ${err.message}`);
    }
}

const login = async (req, res) => {
    try {
        const {emailId, password} = req.body;
        if(!emailId) {
            throw new Error("Invalid Credential");
        }
        if(!password) {
            throw new Error("Invalid Credential");
        }
        // If email exist nhi krta to error fekk dega DB
        const user = await User.findOne({emailId});
        if(!user) {
            throw new Error("Invalid Credential");
        }
        const check = await bcrypt.compare(password, user?.password); // yha await nhi v likhoge to chalega.
        if(!check) {
            throw new Error("Invalid Credential");
        }

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        }

        const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role}, process.env.JWT_KEY, {expiresIn: 3600}); // yha await nhi aata
        res.cookie("token", token, {maxAge: 60*60*1000});
        res.status(201).json({
            user: reply,
            message: "Logged in Successfully"
        })
    } catch(err) {
        res.status(401).send(`Error -> ${err.message}`);
    }
}

const logout = async (req, res) => {
    try {
        const {token} = req.cookies;

        // Then we add token to redis
        const payload = jwt.decode(token);
        await redisClient.set(`token:${token}`, "blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);
        
        // Then Cookies ko clear kr denge
        res.cookie("token", null, {expires: new Date(Date.now())});
        res.send("Logged Out Successfully");
    } catch(err) {
        res.status(503).send(`Error -> ${err}`);
    }
}

const adminRegister = async (req, res) => {
    try {
        // Ye kam krenge to hmme do middleware nhi banane pdenge(userMiddleware and adminMiddleware).
        // if(req.result.role!="admin") {
        //     throw new Error("Invalid Credential");
        // }
        
        // Ham pehle server side validation krenge.
        validate(req.body);
        const {firstName, emailId, password} = req.body;
        // We can check ye emailId khi already exist to nhi krti DB me, but eski jrurt nhi yha.
        // const check = await User.exists({emailId});

        req.body.password = await bcrypt.hash(password, 10);
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role}, process.env.JWT_KEY, {expiresIn: 3600}); // yha await nhi aata
        res.cookie("token", token, {maxAge: 60*60*1000});
        res.status(201).send("User Registered Successfully!");

    } catch(err) {
        res.status(400).send(`Error -> ${err.message}`);
    }
}

const deleteProfile = async (req, res) => {

    try {
        const userId = req.result._id;

        // UserSchema Delete 
        await User.findByIdAndDelete(userId);
        // Submissions delete kro user ka
        // await Submission.deleteMany({userId}); //  Es kam ko mongoose post middleware se krenge.

        res.status(200).send("Account Deleted Successfully");
    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }
}

module.exports = {register, login, logout, adminRegister, deleteProfile};