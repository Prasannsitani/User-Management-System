//jshint esversion:06

//Requiring all the packages
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const saltRounds = 12;

// Local Variables
let change1 = 'Login';
let setName = 'Happy';
let setEmail = 'a@b.com';
let setPhone = '0123456XXX';
let setDob = '00-00-0000';
let setAddress = 'XYZ';
let setCollege = 'XYZ';
let random = Math.floor(1000 + Math.random() * 9000);
var r = random.toString();
var forgotEmail;

//Setting up an app
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static('public'));

//Database connection
mongoose.connect('mongodb://localhost:27017/umsDB',{useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false});

//Transporter of Node Mailer
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
});

//Schema Creation
const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: Number,
  address: String,
  dob: String,
  college: String
});

//Model Creation
const User = mongoose.model('ums',schema);

//Handling Get Requests
app.get('/',(req,res)=>{
      if(setName == 'Happy'){
          res.render('home',{change: _.startCase(change1)});
      }else{
        res.redirect('/home2');
      }
});
app.get('/home2',(req,res)=>{
    if(setName == 'Happy'){
        res.redirect('/');
    }else{
        res.render('home2',{change: _.startCase(change1)});
    }
});
app.get('/login',(req,res)=>{
  res.render('login');
});
app.get('/register',(req,res)=>{
  res.render('register');
});
app.get('/addUser',(req,res)=>{
  check = 'checked';
  if(setName == 'Happy'){
      res.redirect('/');
  }else{
      res.render('addUser',{change: _.startCase(change1),addName: setName,addEmail: setEmail});
  }
});
app.get('/display',(req,res)=>{
  if(setName != 'Happy'){
    User.findOne({email: setEmail},function(err,result){
          if(err)
            throw err;
          else
          {
              res.render('display',
              {
              change: _.startCase(change1),
              addName: result.name,
              addEmail: result.email,
              addPhone: result.phone,
              addAddress: result.address,
              addDob: result.dob,
              addCollege: result.college
            });
          }
        });
      }
    });
app.get('/modify',function(req,res){
  if (setName != 'Happy') {
    User.findOne({email: setEmail},(err,result)=>{
      if(err)
        throw err;
      else
      {
          res.render('modify',
          {
          change: _.startCase(change1),
          addName: result.name,
          addEmail: result.email,
          addPhone: result.phone,
          addAddress: result.address,
          addDob: result.dob,
          addCollege: result.college
          });
      }
    });
  }
  else{
    res.status(400).json({error: "Go and register yourself first!!"});
  }
});
app.get('/login2',(req,res)=>{
  res.render("login2");
});
app.get('/login3',(req,res)=>{
  res.render("login3");
});
app.get('/logout',(req,res)=>{
  change1 = 'Login';
  setName = 'Happy';
  res.redirect('/');
});
app.get('/about',function(req,res){
  res.render("about",{change: _.startCase(change1)});
});

//Handling Post requests
app.post('/register',(req,res)=>{
  if (req.body.password === req.body.cpassword) {
    var flag;
    User.countDocuments({email: req.body.email},function(err,count){
      if(err){
        res.send(err);
      }
      else{
        if(count > 0){
          res.redirect('/login');
        }
        else{
          bcrypt.hash(req.body.password,saltRounds,function(err,hash){
            const user = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash
            });
            user.save(function(err){
              if(err){
                throw err;
              }
              else{
                res.redirect('/login');
              }
            });
          });
        }
      }
    });
    }
    else{
      res.status(400).json({error: 'Type the same password in the confirm password field!!'});
    }
  });

app.post('/login',(req,res) =>{
  User.findOne({email: req.body.email},function(err,result){
    if(err){
      throw err;
    }
    else{
      if(result){
        bcrypt.compare(req.body.password,result.password,function(err,match){
          if(match === true){
            change1 = _.startCase(result.name);
            setName = result.name;
            setEmail = result.email;
            res.redirect('/home2');
          }
          else{
            res.status(400).json({error: 'Sorry, You entered wrong password!!'});
          }
        });
      }
      else{
        res.redirect('/register');
      }
    }
  });
});
app.post('/addUser',(req,res)=>{
  User.findOneAndUpdate({email: setEmail},{$set: req.body},function(err,result){
    if(err)
      throw err;
    else
      res.redirect('/');
  });
});
app.post('/button',(req,res)=>{
  const click = req.body.click;
  if(click === 'Yes'){
    User.findOneAndDelete({email: setEmail},function(err,result){
      if(err)
        throw err;
      else{
        setName = 'Happy';
        change1 = 'Login';
        res.redirect('/');
      }
    });
  }else if(click === 'No'){
    res.redirect('/');
  }else{
    res.status(400).json({error: 'Oops,Something Went Wrong!!'});
  }
});
app.post('/modify',function(req,res){
  User.findOneAndUpdate({email: setEmail},{$set: req.body},function(err,result){
    if(err)
      throw err;
    else{
      if(setEmail != req.body.email){
        change1 = 'Login';
        setName = 'Happy';
        res.redirect('/');
      }
      else{
        res.redirect('/');
      }
    }
  });
});
app.post('/forgotEmail',function(req,res){
  forgotEmail = req.body.forgotEmail;
  User.findOne({email: forgotEmail},function(err,result){
    if(result){
      var mailOptions = {
        from: 'prasannsitani000@gmail.com',
        to: result.email,
        subject: 'Code Check for Security Purpose',
        text: r
      }
      transporter.sendMail(mailOptions,function(err,info){
        if (err) {
          throw err;
        }else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.redirect('/login2');
    }else{
      res.status(400).json({error: "User with this email doesn't exist!!"});
    }
  });
});
app.post('/codeCheck',(req,res)=>{
  if(r === req.body.Code){
    res.redirect('/login3');
  }
  else{
    res.status(400).json({error: "Code is Incorrect!!"});
  }
});
app.post('/changePassword',function(req,res){
  bcrypt.hash(req.body.Password,saltRounds,function(err,hash){
    User.findOneAndUpdate({email: forgotEmail},{password: hash},function(err,result){
      if (err) {
        throw err;
      }else {
        res.redirect('/login');
      }
    });
  });
});
app.post('/resetPassword',function(req,res){
  User.findOne({email: setEmail},function(err,result){
    if (err) {
      throw err;
    }else {
      if (result) {
        bcrypt.compare(req.body.oldPass,result.password,function(err,match){
          if (err) {
            throw err;
          } else {
            if (match === true) {
              bcrypt.hash(req.body.newPass,saltRounds,function(err,hash){
                User.findOneAndUpdate({email: setEmail},{password: hash},function(err,docs){
                  if (err) {
                    throw err;
                  } else {
                    res.redirect('/home2');
                  }
                });
              });
            }
            else{
              res.status(400).json({error: 'Please write correct old password else you refer to forgot password section!!'});
            }
          }
        });
      }else{
        res.status(400).json({error: 'Might be there is a server issue or you have not registered yet??'});
      }
    }
  })
});


//Listen method to starting the server.
let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port,function(){
  console.log("Server has started successfully!!");
});
