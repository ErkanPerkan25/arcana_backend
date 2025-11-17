import express, { response } from "express"
import db from "../db/conn_db.js";
import User from "../middleware/user_model.js";
import validateJWT from "../middleware/validateJWT.js";
import Book from "../middleware/book_model.js";
import Note from "../middleware/note_model.js";
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
            const book = Book.findOne({title: title, author: author});

            if(book){
                const newBook = new Book({
                    title: title, 
                    author: author, 
                    olid: olid
                });

                try{
                    const result = await newBook.save();
                    
                    console.log("Book have been saved");
                   
                    if(!result){
                        res.status(404).send("issue with saving book");
                    }

                    Book.findOne({title: title, author: author})
                        .then(result =>{ 
                            const id_book = result._id.toString();
                            User.updateOne({ _id: cookie.username },{ $push: {books_id: id_book} })
                                .catch(error =>{
                                    console.log("Issue with adding books to user");
                                    res.status(400).send(error);
                                })
                            res.status(201).send("Success");
                        })
                        .catch(error =>{
                            console.log("Issue with finding book in MongoDB");
                            res.status(400).send(error);
                        });
                }
                catch(error){
                    console.log("here")
                    res.status(400).send(error);
                }
            }
            else{
                const id_book = book._id.toString();
                User.updateOne({ _id: cookie.username },{ $push: {books_id: id_book} })
                    .then(() =>{
                        console.log("we get to book");
                        res.status(201).send("Success");
                    })
                    .catch(error =>{
                        res.status(400).send(error);
                    })
            }
        }
        else{
            res.status(400).send("Issue with request parameters to the server!");
        }
    }

});

router.delete("/:id", async(req,res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "Failed to verify token!",
        })
    }
    else{
        try{
            const book = await Book.deleteOne({_id: req.params.id});

            if(!book){
                res.status(404).json({message: "Couldn't find the book"});
            }

            const notes = await Note.deleteMany({book_id: req.params.id, user_id: req.body.cookie.username });

            if(!notes){
                res.status(404).json({message: "Issue with deleting notes"});
            }
            
            return res.status(200).json({message: "Successfully deleted book and its notes"});
        }
        catch(error){
            console.log(error);
            return res.status(400).send(error);
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
