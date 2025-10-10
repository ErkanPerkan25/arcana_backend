import User from "../middleware/user_model.js";
import jwt from "jsonwebtoken";

function validateJWT(req){
    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        res.status(200).json({
            success: false,
            message: "Error! Token was not provided!"
        });
    }

    const decodedToken = jwt.verify(token, "secretkeyappearshere");

    return decodedToken;
}

export default validateJWT;
