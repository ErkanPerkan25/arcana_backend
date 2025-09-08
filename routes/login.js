import express, { response } from "express"
import db from "../db/conn_db.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { User } from "../middleware/user_model.js"
const router = express.Router();

router.post("/", async (req,res) =>{
    const authInfo = req.body;

    //console.log(authInfo.username);

    if(!authInfo)
        return res.status(400).send({status: 'failed'});


    let users = db.collection("users");

    let result = await users.find({email: null}).toArray();

    console.log(result);

    if(result.length !== 0){
        return res.status(200).send({status: 'recieved', response: result});
    }
    else{
        return res.status(400).send("Account does not exits");
    }

});

export default router;
