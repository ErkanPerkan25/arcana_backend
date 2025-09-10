import express, { response } from "express"
import db from "../db/conn_db.js";
const router = express.Router();
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import User from "../middleware/user_model.js";

router.post("/", async (req,res) =>{
    const authInfo = await req.body;

    if(!authInfo)
        return res.status(400).send({status: 'failed'});

    User.findOne({ email: "erichansson.united@gmail.com" })
        .then(user =>{
            if(!user){
                console.log(user);
                return res.status(400).send("Account does not exits");
            }
            else{
                if(user.validatePassword(authInfo.password)){
                    return res.send("<h1>You are logged in!</h1>");
                }
                else{
                    return res.status(400).send("Wrong email or passwrod!");
                }
            }
        })
        .catch(err =>{
            throw err;
        });
});

export default router;
