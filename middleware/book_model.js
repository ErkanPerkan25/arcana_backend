import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema({
    title:{
        type: "string",
        require: true,
        createIndexes: {unique: true},
    },
    author:{
        type: "string",
        require: true,
    },
    olid:{
        type: "string",
        require: true,
    }
});

schema.pre("save", async function save(next){
    const book = this;    

    if(book.title)
        book.title = book.title.trim();

    if(book.author)
        book.author = book.author.trim();
    
    if(book.olid)
        book.olid = book.author.trim();

    try{
        return next();
    }
    catch(error){
        return next(error);
    }
});

const Book = mongoose.model("Book", schema);

export default Book;
