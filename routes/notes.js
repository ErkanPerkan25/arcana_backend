import express from "express"
import validateJWT from "../middleware/validateJWT.js";
import Note from "../middleware/note_model.js";

const router = express.Router();

router.get("/", async(req, res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "Failed to verify token!",
        });
    }
    else{
        Note.find({user_id: req.query.user_id, book_id: req.query.book_id})
            .then(data =>{
                res.status(200).send(data);
            })
            .catch(error =>{
                res.status(400).send(error);
            });
    }
});

router.post("/", async(req,res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "failed to verify token!",
        });
    }
    else{
        const note = await Note.create({
            title: "Title",
            content: "",
            book_id: req.body.book_id,
            user_id: req.body.cookie.username
        });

        res.status(201).send("Successfuly created a note.");
    }
});

router.put("/:id", async(req,res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "failed to verify token!",
        });
    }
    else{
        Note.updateOne({_id: req.params.id, user_id: req.body.cookie.username},
            {$set: {title: req.body.title, content: req.body.content, lastModified: Date.now()}})
        .then(response =>{
                res.status(200).send(response);
        })
        .catch(error =>{
            res.status(400).send(error);
        })
    }

});

router.delete("/", async(req,res) =>{
    const decodedToken = validateJWT(req);

    if(!decodedToken){
        return res.status(400).json({
            message: "failed to verify token!",
        });
    }
    else{
        Note.deleteOne({_id: req.query.id})
        .then(response =>{
            res.status(200).send(response);
        })
        .catch(error =>{
            res.status(400).send(error);
        })
    }

});

export default router;
