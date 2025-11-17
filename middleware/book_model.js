import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema({
    title:{
        type: String,
        require: true,
        createIndexes: {unique: true},
    },
    author:{
        type: String,
        require: true,
    },
    olid:{
        type: String,
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
        book.olid = book.olid.trim();

    try{
        return next();
    }
    catch(error){
        return next(error);
    }
});

schema.index({title: 1}, {unique: true});

const Book = mongoose.model("Book", schema);

export default Book;
