import express from "express"
import db from "../db/conn_db.js";
const router = express.Router();
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../middleware/user_model.js";

const basicAuth = (req, res, next) =>{
    if(!req.headers.authorization || req.headers.authorization.indexOf("Basic ") === -1){
        return res.status(404).send("Missing authorization header");
    }

    const base64credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64credentials, "base64").toString("ascii");
    const [email, password] = credentials.split(":");
    req.auth = {email: email, password: password};

    next();
}

router.post("/login", basicAuth, async (req,res) =>{
    const { email, password } = req.auth;
        
    User.findOne({ email: email })
        .then(existingUser =>{
            if(!existingUser){
                console.log("Error with user!");
                console.log(existingUser)
                return res.status(400).send("Account does not exits");
            }
            else{
                if(existingUser.validatePassword(password)){

                    let token;

                    try{
                        token = jwt.sign({
                            userId: existingUser.id,
                            email: existingUser.email
                        },
                        "secretkeyappearshere",
                        {expiresIn: "1h"},
                        );

                    }
                    catch(err){
                        console.error(err);
                        throw err;
                    }

                    //res.cookie("token", token, {httpOnly: true});

                    return res.status(200).json({
                        success: true,
                        data: {
                            userId: existingUser.id,
                            email: existingUser.email,
                            token: token
                        }
                    });
                }
                else{
                    //return res.status(400).send("Wrong email or passwrod!");
                    return res.status(400).json({
                        message: "Invalid credentials"
                    });
                }
            }
        })
        .catch(err =>{
            throw err;
        });

    
});


router.post("/signup", async (req,res)=>{
    const {username, email, password} = req.body;

    !User.findOne({email: email})
        .then(result =>{
            if(result === null){
                const user = new User({
                    username: username,
                    email: email,
                    password: password,
                });


                user.save()
                    .catch(err =>{
                        console.log("Error creating new user!");
                        throw err;
                    });

                let token;

                try{
                    token = jwt.sign(
                        {
                            userId: user.id,
                            email: user.email
                        },
                        "secretkeyappearshere",
                        {expiresIn: "1h"}
                    );
                }
                catch(err){
                    console.error("Could not create JWT token");
                    throw(err);
                }

                return res.status(201).json({
                    success: true,
                    data: {
                        userId: existignUser.id,
                        email: existignUser.email,
                        token: token
                    }
                });
            }
        })
        .catch(err =>{
            throw err;
        })

});
export default router;
