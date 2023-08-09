const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var jwt = require("jsonwebtoken");
var bcryptjs = require("bcryptjs");
const preferencesRoutes = require('express').Router();
const verifyToken = require('../middleware/authJWT');
const user = require('../models/user');
const {validatePreferences} = require('../validators/validator');

preferencesRoutes.use(bodyParser.json());

//Get News preferences of logged in user
preferencesRoutes.get('', verifyToken, (req, res) => { 
  console.log("In get ");
  if (!req.user && req.message) { 
    return res.status(403).send({ message: req.message });
  }
  if (!req.user && req.message == null) {
    return res.status(401).send({ message: "Invalid JWT token" });
  }
  return res.status(200).send("News Preferences of logged in user: "+req.user.newsPreferences);
  //res.send(user);
});


//Update News preferences of logged in user
preferencesRoutes.put('', verifyToken, (req, res) => { 
  console.log("In put ");
  if (!req.user && req.message) { 
    return res.status(403).send({ message: req.message });
  }
  if (!req.user && req.message == null) {
    return res.status(401).send({ message: "Invalid JWT token" });
  }
  //validate & update preferences
  if(validatePreferences(req.body.newsPreferences)) { 
    req.user.newsPreferences = req.body.newsPreferences;
    req.user.updatedDate = Date.now();
    req.user.save().then(data => { 
      return res.status(200).send('Preferences updated successfully'); 
    }).catch(err => { 
      return res.status(500).send('Preferences updation failed : '+err);
    });
  } else {
    return res.status(400).send({ message: 'Invalid Preferences !!' })
  }
  
});

module.exports = preferencesRoutes;