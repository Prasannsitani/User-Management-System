//jshint esversion:06

//Requiring all the packages
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const saltRounds = 10;

//Setting up an app
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static('public'));

//Database connection
mongoose.connect('mongodb://localhost:27017/umsDB',{useNewUrlParser: true,useUnifiedTopology: true});

//Schema Creation
const schema = new mongoose.Schema({
  email: String,
  password: String
});

//Model Creation
const User = mongoose.model('ums',schema);

//Handling Get Requests
app.get('/',(req,res)=>{
  res.render('home');
});
app.get('/login',(req,res)=>{
  res.render('login');
});
app.get('/register',(req,res)=>{
  res.render('register');
});

//Handling Post requests
app.post('/register',(req,res)=>{
  bcrypt.hash(req.body.password,process.env.SALTROUNDS,function(err,hash){
    const user = new User({
      email: req.body.email,
      password: hash
    });
  user.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.redirect('/');
    }
    });
  });
});
app.post('/login',(req,res) =>{
  User.findOne({email: req.body.email},function(err,result){
    if(err){
      res.send(err);
    }
    else{
      if(result){
          bcrypt.compare(result.password,req.body.password,function(err,match){
            if(match == true){
              res.redirect('/');
            }
            else{
              res.send('wrong password');
            }
          });
      }
    }
  });
});

//Listen method to starting the server.
app.listen(3000,function(){
  console.log("Server started at port 3000");
});
