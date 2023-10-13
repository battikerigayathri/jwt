//creating routes
const User = require("../models/user.model");
const Router = require(`express`).Router();
   const users = [];
                   

                  //register 
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("REGISTERED SUCCESFULLY");
    // Generating  a random salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Store the user in your database
    const User = { username, email, password: hashedPassword, salt };
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
       return res.status(401).json({ message: "Authentication failed" });
       }
       //finding the users email in data base
       if (User.email === email) {
           return res.status(200).json({ message: "email autentication successfull" });
       } else {
           res.status(401).json({ message: "email authentication failed" });
         }
     // Hash the entered password with the user's salt
     const hashedPassword = await bcrypt.hash(password, user.salt);

     // Compare the hashed password with the stored hashed password
     if (hashedPassword === User.password) {
       res.json({ message: "Login successful" });
     } else {
       res.status(401).json({ message: "Authentication failed" });
     }
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Internal server error" });
   }
 });
 app.get("/form", (req, res) => {
   res.render("form");
 });
 app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
 });

 
                            
                            