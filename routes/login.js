import express, { response } from "express"
import db from "../db/conn_db.js";
import { ObjectId } from "mongodb";

import bcrypt from "bcrypt";
const saltRounds = 10;

const router = express.Router();

router.post("/", async (req,res) =>{
    const authInfo = req.body;

    //console.log(authInfo.username);

    if(!authInfo)
        return res.status(400).send({status: 'failed'});


    let users = db.collection("users");

    let result = await users.find({email: `${authInfo.username}`}).toArray();

    if(!result){
        return res.status(400).send("Account does not exits");
    }

    res.status(200).send({status: 'recieved', response: result});
    //console.log(result);
});

export default router;
