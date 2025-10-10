import express from "express"
import db from "../db/conn_db.js";
import User from "../middleware/user_model.js";
import validateJWT from "../middleware/validateJWT.js";
import Book from "../middleware/book_model.js";
//import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/addBook", async (req,res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "Failed to verify token!",
        });
    }

});

router.get("/", async (req,res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "Failed to verify token!",
        })
    }
    else{
        User.findOne({email: decodedToken.email}, {books_id: 1}).lean()
            .then(data =>{
                Book.find({}).lean()
                    .then(data =>{
                        res.status(200).json(data);
                    })
                    .catch(error =>{
                        throw error;
                    })
            })
            .catch(err =>{
                throw err;
            });
    }
});

export default router;
