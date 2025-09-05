import express from "express"
import db from "../db/conn_db.js";
import { ObjectId } from "mongodb";

import bcrypt from "bcrypt";
const saltRounds = 10;

const router = express.Router();

router.post("/", async (req,res) =>{
    const authInfo = req.body;

    console.log(authInfo);

    if(!authInfo)
        return res.status(400).send({status: 'failed'});

    res.status(200).send({status: 'recieved'});

    let users = db.collection("users");

    let result = await users.find({}).limit(50).toArray();
    
});

export default router;
