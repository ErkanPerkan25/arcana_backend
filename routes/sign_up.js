import express from "express"
import db from "../db/conn_db.js";
const router = express.Router();
import User from "../middleware/user_model.js"
import { connect } from "mongoose";

router.post("/", async (req,res)=>{
    const args = req.body;
    
    console.log(args);

    !User.findOne({email: args.email})
        .then(result =>{
            if(result === null){
                const user = new User({
                    username: args.username,
                    email: args.email,
                    password: args.password,
                });

                user.save()
                    .catch(err =>{
                        console.log("Error creating new user!");
                        throw err;
                    });

                return console.log("Successfully created and stored a user!");
            }
            else{
                return console.log("Account already exits! Abort!");
            }
        })
        .catch(err =>{
            throw err;
        })

});

export default router;
