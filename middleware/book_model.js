import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
const salt = await bcrypt.genSalt(10);


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

const Book = mongoose.model("Book", schema);

export default Book;
