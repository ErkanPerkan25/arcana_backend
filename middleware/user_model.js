import mongoose from "mongoose";
import { Schema } from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;
//import { isEmail} from "validator";
import bcrypt from "bcrypt";
const salt = await bcrypt.genSalt(10);


const schema = new Schema({
    username:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        validate: [isEmail, "Invalid email"],
        createIndexes: {unique: true},
    },
    password:{
        type: String,
        require: true,
    },
    books_id:{
        type: [String],
        require: true,
        default: undefined
    }
});

// Saves user to database
schema.pre("save", async function save(next){
    const user = this;    

    if(!user.isModified("password")) return next();

    if(user.email)
        user.email = user.email.trim().toLowerCase();

    if(user.username)
        user.username = user.username.trim();
    
    try {
        user.password = await bcrypt.hash(user.password, salt);
        
        return next();
    }
    catch(err){
        return next(err);
    }
});

// Compares passwords
schema.methods.validatePassword = async function(data){
    const hashedPass = await bcrypt.hash(data,salt);
    return bcrypt.compare(hashedPass, this.password);
};

const User = mongoose.model("User", schema);

export default User;
