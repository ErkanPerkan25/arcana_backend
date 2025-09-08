import { Schema } from mongoose;
import { isEmail, isModified } from "validator"
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const saltRounds = 10;


const schema = new Schema({
    username:{
        type: string,
        require: true,
    },
    email:{
        type: string,
        require: true,
        validate: [isEmail, "Invalid email"],
        createIndexes: {unique: true},
    },
    password:{
        type: string,
        require: true,
    }
});

schema.pre("save", async function save(next){
    if(!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    }catch(err){
        return next(err);
    }
});

schema.methods.validatePassword = async function validatePassword(data){
    return bcrypt.compare(data, this.password);
}

const User = mongoose.Model("User", schema);

export default User;
