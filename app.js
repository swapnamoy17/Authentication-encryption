//jshint esversion:6
//Authentication & Encryption
require('dotenv').config();                       //For securing API keys etc
const encryption = require('mongoose-encryption');//For encryption

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');




const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsDB",{
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encryption, {secret: process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.route("/")
.get(function(req,res){
  res.render("home");
});

app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
      if(password===foundUser.password){
        console.log("Successfully logged in.");
        res.render("secrets");
      }
      else{
        console.log("Wrong username or password.");
      }
    }
    }
  });
})

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully registered a new user.");
      res.render("secrets");
    }
  });
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
