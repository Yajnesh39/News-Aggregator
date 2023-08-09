const express = require('express');
const bodyParser = require('body-parser');
const routes = require('express').Router();
const mongoose = require('mongoose');
var jwt = require("jsonwebtoken");
var bcryptjs = require("bcryptjs");
const {signup,signin} = require('../src/controllers/authController');
const preferencesInfo = require('../src/routes/preferencesInfo');
const newsInfo = require('./routes/newsInfo');
require("dotenv").config();

const app = express(); //create server

app.use(bodyParser.json()); //Use middleware
app.use(routes); //Use Routes

const PORT = 3000;
app.listen(process.env.PORT || PORT, (error) =>{
  if(!error)
      console.log("Server is Successfully Running and App is listening on port " + PORT);
  else
      console.log("Error occurred, server can't start", error);
  }
);

//Connect to mongodb database
try {
    mongoose.connect('mongodb://localhost:27017/usersdb' , {
        useUnifiedTopology : true,
        useNewUrlParser : true 
    });
    console.log('Connected successfully to the mongo database : usersdb')
} catch (error) {
    console.log(error);
};


//Basic end point
app.get('/' , (req,res) => {
    res.status(200).send("Welcome to News Aggregator !!");
});


//Endpoints for register & sign-in
routes.post('/register' , signup);
routes.post('/login' , signin);

//Get & Update Preferences of logged-in user
routes.use('/preferences' , preferencesInfo);

//Get News articles based on newsPreferences of logged-in user
routes.use('/news' , newsInfo);