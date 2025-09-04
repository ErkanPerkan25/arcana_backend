module.exports = function(app){
    app.get("/users", async(req,res)=>{
        res.send("got a response for the request");
    });
}
