// landing page home page; index.html/index.js/index.php
const express=require('express')
const path=require('path')
const bcryptjs=require('bcryptjs')
const collection=require('./config.js')

//express is an object and we are creating an instance called app
const app=express()

// convert data imported to the form to json format eg email: example@gmial.com ,password:234323434  this is how we accept the data
//by converting the data to a json format we are making the data lightweight and have more qulaity

app.use(express.json())   
 
//indicating static files

app.use(express.static("public"))

//URL Encoding: to protect

app.use(express.urlencoded({extended:false})) 

//EJS

app.set("view engine","ejs")

//Render 

app.get("/",(req,res)=>{
     res.render("home")
});

app.get("/signup",(req ,res )=>{
    res.render("signup")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

//post for signup
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcryptjs.hash(data.password, saltRounds);
        data.password = hashedPassword; // Replace the original password with the hashed one
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});


// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcryptjs.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});




//port
const port= 3000;
app.listen(port, ()=>{
   console.log(`server is runing on port: ${port}`) ;
})



