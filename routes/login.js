const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function(app){
    app.post("/login", (req,res) =>{
        const authInfo = req.body;
        console.log(authInfo);
    });
}
