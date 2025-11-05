import express from "express"
import db from "../db/conn_db.js";
import validateJWT from "../middleware/validateJWT.js";
import Note from "../middleware/note_model.js";

const router = express.Router();

router.get("/", async(req, res) =>{

});

router.post("/", async(req,res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "Failed to verify token!",
        });
    }
    else{
        console.log(req.body);
        const note = await Note.create({
            title: "",
            content: "",
            book_id: req.body.book_id,
            user_id: req.body.cookie.username
        });
        console.log(note);

        res.status(201).send("Successfuly created a note.");
    }
});

router.put("/:id", async(req,res) =>{

});

export default router;
