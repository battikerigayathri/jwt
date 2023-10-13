const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const port = 2000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/HASHINGMETHOD")
  .then(() => {
    console.log({ message: "database connected successfully", status: true });
  }).catch((error) => {
    console.log({ message: "failed to connect db", status: false });
})
//Define the payload(claims)
const users = {
  
    // Subject
  name: String,
 password:String,
};
const User = [];
app.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log("REGISTERED SUCCESFULLY");
    // Generating  a random salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password with the salt
      const hashedPassword = await bcrypt.hash(password, salt);
   
    // Store the user in your database
    const userData = {  name, password: hashedPassword ,salt};
    User.push(userData)
      
  

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { name,  password } = req.body;

    // Finding  the user in your database
    const users = User.find((u) => u.name === name);

    
    // Hash the entered password with the user's salt
    const hashedPassword = await bcrypt.hash(password, users.salt);

    // Compare the hashed password with the stored hashed password
    if (hashedPassword === users.password) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: " login Authentication failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Secret key for signing the token (keep it secret)
const secretKey = "thisismyfirstsecret."; // Replace with your actual secret key

// Generate the JWT
const token = jwt.sign(users, secretKey);

console.log("Generated Token:", token);
// Verify and decode the JWT
jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    console.error("Token verification failed:", err.message);
  } else {
    console.log("Decoded Token:", decoded);
  }
});
app.listen(port, () => {
    console.log(`server runs at ${port}`);
})
