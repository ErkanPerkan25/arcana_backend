import express from "express"
import db from "../db/conn_db.js";
import User from "../middleware/user_model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async(req, res) =>{
    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        res.status(200).json({
            success: false,
            message: "Error! Token was not provided!"
        });
    }

    const decodedToken = jwt.verify(token, "secretkeyappearshere");

    if(!decodedToken){
        return res.status(400).json({
            message: "Failed to verify token!",
        })
    }
    else{
        User.findOne({email: decodedToken.email})
            .then(user =>{
                console.log(user);
                return res.status(200).json({
                    username: user.username,
                    email: user.email,
                })
            })
            .catch(err =>{
                throw err;
            });
    }
});

export default router;
