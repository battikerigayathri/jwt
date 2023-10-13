const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const port = 2000;
const User=require('./app5')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
// mongoose.connect("mongodb://localhost/HASHINGMETHOD")
// .then(()=>{
//     console.log({message:"database connected",status:true})
// }).catch((error) => {
//     console.log({message:"failed to connect db",status :false})
// })
// Define a user schema and model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);
//creating routes
const users = [];
//register form 
app.post("/register", async (req, res) => {
  try {
    const { username, email,password } = req.body;
      console.log("REGISTERED SUCCESFULLY");
    // Generating  a random salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
   // Store the user in your database
    const User = { username,email, password: hashedPassword, salt };
    users.push(User);

      res.status(201).json({ message: "User registered successfully" });
     
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

   // login
 app.post("/login", async (req, res) => {
   try {
     const { username,email, password } = req.body;

     // Finding  the user in your database
     const user = users.find((u) => u.username === username);

     if (!user) {
       return res.status(401).json({ message: " user Authentication failed " });
       }
       //finding the users email in data base
       if (user.email !== email) {
           return res
             .status(401)
             .json({ message: "email authentication failed" });
       } 
     // Hash the entered password with the user's salt
     const hashedPassword = await bcrypt.hash(password, user.salt);

     // Compare the hashed password with the stored hashed password
     if (hashedPassword === user.password) {
       res.json({ message: "Login successful" });
     } else {
       res.status(401).json({ message: " login Authentication failed" });
     }
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Internal server error" });
   }
 });



app.get("/form", (req, res) => {
    res.render("form");
     
})
app.get("/register", (req, res) => {
  res.render("register");

});app.get("/login", (req, res) => {
  res.render("login");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


