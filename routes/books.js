import express from "express"
import db from "../db/conn_db.js";
import User from "../middleware/user_model.js";
import validateJWT from "../middleware/validateJWT.js";
import Book from "../middleware/book_model.js";
//import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/addBook", async (req,res) =>{
    const decodedToken = validateJWT(req,res);

    if(!decodedToken){
        return res.status(400).json({
            message: "Failed to verify token!",
        });
    }
    else{
        if(req.body){
            const {title, author, olid, cookie} = req.body;
            Book.findOne({title: title, author: author})
                .then(result =>{
                    if(result === null){
                        const book = new Book({
                            title: title, 
                            author: author, 
                            olid: olid
                        });

                        try{
                            book.save().then(() => console.log("Book saved!")).catch(error =>{throw error});
                        }
                        catch(error){
                            res.status(400).send(error);
                        }

                        Book.findOne({title: title, author: author})
                            .then(result =>{ 
                                const id_book = result._id.toString();
                                User.updateOne({ _id: cookie.username },{ $push: {books_id: id_book} })
                                    .catch(error =>{
                                        res.status(400).send(error);
                                    })
                                console.log("we get to book");
                                res.status(201).send("Success");
                            })
                            .catch(error =>{
                                res.status(400).send(error);
                            });

                    }
                    else{
                        Book.findOne({title: title, author: author})
                            .then(result =>{ 
                                const id_book = result._id.toString();
                                User.updateOne({ _id: cookie.username },{ $push: {books_id: id_book} })
                                    .catch(error =>{
                                        res.status(400).send(error);
                                    })
                                console.log("we get to book");
                                res.status(201).send("Success");
                            })
                            .catch(error =>{
                                res.status(400).send(error);
                            });
                    }
                })
                .catch(error =>{
                    throw error; 
                })
        }
        else{
            res.status(400).send("Issue with parameters!");
        }
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
                const user_collection = data.books_id;
                Book.find({_id: user_collection}).lean()
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
