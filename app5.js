const express = require("express");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const secretkey="thisismyfirstsecret."
const app = express();
app.get("/", (req, res) => {
    res.json({
        message: "a simple api"
        

    })
})
mongoose
  .connect("mongodb://localhost:27017/HASHINGMETHOD")
  .then(() => {
    console.log({ message: "databasae connected successfully" });
  })
  .catch((error) => {
    console.log({ messagae: "failed to connect db" });
  });
app.post("/login", (req, res) => {
    const user = {
        id: 1,
        username: "john",
        email: "john123@gmail.com"
    }
    jwt.sign({ user }, secretkey, { expiresIn: '500s' }, (err, token) => {
         res.json({ token });
    })
       
})
app.post("/profile", verifyToken, (req, res) => {
    jwt.verify(req.token, secretkey, (err, authData) => {
        if (err) {
            res.send({ result: "invalid token" })
        } else {
            res.json({
                msg: "profile accessed",
                authData
            })
        }
    })
})
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.send({token:"token is not valid"})
    }
    }
app.listen(4000, () => {
    console.log("server runs at 4000 port");
})
  
    

     
