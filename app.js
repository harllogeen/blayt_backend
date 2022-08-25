// import All Dependencies
const dotenv = require('dotenv');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

//Configure ENV File & Require connection File
dotenv.config({path : './config.env'});
require(
    './db/conn'
);

const port = process.env.PORT;

const mongoose = require('mongoose');



//Require Model
const Users = require('./models/userSchema')
const Message = require('./models/msgSchema');
const Apply = require('./models/applySchema');
const authenticate = require('./db/middleware/authenticate')

//These Methos is Used to Get Data and cookies from Fronthend
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.send("Hello World")
})

//Registration
app.post('/register', async (req, res)=>{
    try {
        //Get body or Data
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username : username,
            email : email,
            password : password
        })

        //Save Methos is used to Created User or Insert User
        //But Before Saving or Inserting, Passworrd wiil Hash
        //Besause of Hashing. after Hash, it will save to Db
        const created = await createUser.save()
        console.log(created);
        res.status(200).send("Registered");

    } catch (error) {
        res.status(400).send(error)
    }
})

//Login
app.post('/login', async (req, res)=>{
    try {
        //Get body or Data
        const email = req.body.email;
        const password = req.body.password;

        //Find User if Exist
        const user = await Users.findOne({email : email});
        if(user){
            //Verify Password
            const isMatch = await bcryptjs.compare(password, user.password)

            if(isMatch){
                //Generate Token which is Define in user Schema
                const token = await user.generateToken();
                res.cookie("jwt", token, {
                    //Expires Token in 24 Hours
                    expires: new Date(Date.now()+ 8640000),
                    httpOnly : true
                })
                res.status(200).send("LoggedIn")
            }else{
                res.status(400).send("Invalid Credentials")
            }
        }else{
            res.status(400).send("Invalid Credentials")
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

//Logout Page
app.get('/logout', (req, res)=>{
    res.clearCookie("jwt", {path : "/"})
    res.status(200).send("User Logged Out")
})

//Authentication
app.get("/auth", authenticate, (req, res)=>{
    
})


//Run Server
app.listen(port, ()=>{
    console.log("Server is Listening")
})

//Message
app.post('/message', async (req, res)=>{
    try {
        //Get body or Data
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;

        const sendMsg = new Message({
            name : name,
            email : email,
            message : message
        })

        //Save Methos is used to Created User or Insert User
        //But Before Saving or Inserting, Passworrd wiil Hash
        //Besause of Hashing. after Hash, it will save to Db
        const created = await sendMsg.save()
        console.log(created);
        res.status(200).send("Sent");

    } catch (error) {
        res.status(400).send(error)
    }
})
//Applying
app.post('/dashboard', async (req, res)=>{
    try {
        //Get body or Data
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const confirmemail = req.body.confirmemail
        const message = req.body.message;
        const age = req.body.age;
        const password =req.body.password;
        const track = req.body.track;
        const about = req.body.about

        const sendMsg = new Apply({
            firstname : firstname,
            email : email,
            message : message,
            age : age,
            confirmemail : confirmemail,
            password : password,
            lastname :lastname,
            track : track,
            about : about
        })

        //Save Methos is used to Created User or Insert User
        //But Before Saving or Inserting, Passworrd wiil Hash
        //Besause of Hashing. after Hash, it will save to Db
        const created = await sendMsg.save()
        console.log(created);
        res.status(200).send("Sent");

    } catch (error) {
        res.status(400).send(error)
    }
})


//backend done