import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema({
    content:{
        type: String,
    },
    title:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    lastModified:{
        type: Date,
        default: Date.now
    },
    book_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

schema.pre("save", async function save(next){
    const note = this;    

    try{
        return next();
    }
    catch(error){
        return next(error);
    }
});

const Note = mongoose.model("Note", schema);

export default Note;
